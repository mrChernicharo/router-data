import { supabase, channel /** supabaseAdmin */ } from "./supabaseClient";
import { DEFAULT_PROFESSIONAL_AVAILABILITY, LAMBDA_URL } from "./constants";
import { FULL_WEEK_AVAILABILITY, dateStrToDBDate } from "./helpers";

const insertStaff = async ({ email, category }) => {
  console.log("insertStaff", { email, category });
  const { data, error } = await supabase.from("staff").insert([{ email, category }]).select();
  if (error) return console.log(error);

  const staff = data[0];

  channel.send({
    type: "broadcast",
    event: "staff_created",
  });

  return { staff };
};

const removeStaff = async person => {
  // console.log("remove staff", { person });

  if (person.professional) {
    // console.log("that's an existing professional");
    await removeProfessional(person.professional.id);
  }

  const { data, error } = await supabase.from("staff").delete().match({ email: person.email }).select();
  if (error) return console.log(error);

  const entry = data[0];

  channel.send({
    type: "broadcast",
    event: "staff_removed",
  });

  return { entry };
};

const createUser = async credentials => {
  const { email, auth_id } = credentials;
  console.log({ credentials });

  const { data: staffData, error: sErr } = await supabase.from("staff").select("*").eq("email", email);
  if (sErr) {
    console.log(sErr);
    return sErr;
  }

  const staff = staffData[0] ?? null;

  // console.log("createUser", { credentials, staff });

  if (staff) {
    if (staff.category === "professional") {
      const newProf = await insertProfessional({ email, auth_id });
      return newProf;
    }
    // professional | manager | admin
  } else {
    // customer
    const newCustomer = await insertCustomer({ email, auth_id });
    return newCustomer;
  }
};

const insertProfessional = async ({ email, auth_id }) => {
  const isAdminCreated = !auth_id;
  // console.log(!isAdminCreated ? "Customer Signup" : "Admin Created Customer");

  if (isAdminCreated) {
    const { data: authData } = await supabase.auth.signUp({ ...person, password: "12345678" });
    person.auth_id = authData.user.id;
  }

  const { data, error } = await supabase.from("professionals").insert([{ email, auth_id }]).select();
  if (error) return console.log(error);

  const professionalAvailability = (isAdminCreated ? FULL_WEEK_AVAILABILITY : []).map(o => ({
    ...o,
    customer_id: customer.id,
    status: "1",
  }));

  const { data: availability, error: err2 } = await supabase
    .from("professional_availability")
    .insert(professionalAvailability)
    .select();
  if (err2) return console.log(err2);

  const entry = { ...data[0], availability, appointments: [] };

  // console.log("insertProfessional", { entry });

  channel.send({
    type: "broadcast",
    event: "professional_added",
  });

  return entry;
};

const removeProfessional = async id => {
  // console.log("removeProfessional", { id });

  // // 1. remove professional availability slots
  const { data: removedProfessionalAvailability, error: err } = await supabase
    .from("professional_availability")
    .delete()
    .match({ professional_id: id })
    .select();
  if (err) return console.log(err);

  // 2. remove professional appointments
  const { data: removedAppointments, error: err1 } = await supabase
    .from("realtime_appointments")
    .delete()
    .match({ professional_id: id })
    .select();
  if (err1) return console.log(err1);

  // 3. patch status of affected customer_availabilities
  const availsToPatch = [];
  removedAppointments.forEach(appointment => {
    const { customer_id, day, time } = appointment;
    availsToPatch.push({ customer_id, day, time });
  });
  const [customerIds, days, times] = [
    availsToPatch.map(o => o.customer_id),
    availsToPatch.map(o => o.day),
    availsToPatch.map(o => o.time),
  ];

  let updatedCustomerAvails = null;
  if (customerIds.length && days.length && times.length) {
    const { data, error: err3 } = await supabase
      .from("customer_availability")
      .update({ status: "1" })
      .filter("customer_id", "in", `(${customerIds})`)
      .filter("day", "in", `(${days})`)
      .filter("time", "in", `(${times})`)
      .select();

    if (err3) return console.log({ err3 });
    updatedCustomerAvails = data;
  }

  // 4. delete professional!
  const { data: deletedProfessional, error } = await supabase.from("professionals").delete().match({ id }).select();
  if (error) return console.log(error);

  // console.log({
  //   deletedProfessional,
  //   removedAppointments,
  //   removedProfessionalAvailability,
  //   updatedCustomerAvails,
  //   availsToPatch,
  //   customerIds,
  //   days,
  //   times,
  // });

  channel.send({
    type: "broadcast",
    event: "professional_removed",
  });

  return deletedProfessional[0];
};

const insertCustomer = async person => {
  const isAdminCreated = !person.auth_id;
  // console.log(!isAdminCreated ? "Customer Signup" : "Admin Created Customer");

  // const { registeredEmails } = await fetch(`${LAMBDA_URL}/get-registered-users`).then(async res => await res.json());
  const { data: customerEmails, error: cErr } = await supabase.from("customers").select("email");
  if (cErr) return cErr;

  if (customerEmails.map(d => d.email).includes(person.email)) {
    throw new Error(`Já existe um cliente cadastrado com o email ${person.email}`);
  }

  if (isAdminCreated) {
    const { data: authData } = await supabase.auth.signUp({ ...person, password: "12345678" });
    person.auth_id = authData.user.id;
  }

  const { data, error } = await supabase.from("customers").insert([person]).select();
  if (error) return error;

  const customer = data[0];

  const customerAvailability = (isAdminCreated ? FULL_WEEK_AVAILABILITY : []).map(o => ({
    ...o,
    customer_id: customer.id,
    status: "1",
  }));

  const { data: availability, error: err2 } = await supabase
    .from("customer_availability")
    .insert(customerAvailability)
    .select();
  if (err2) return err2;

  // console.log("addCustomer", { customer, availability });

  channel.send({
    type: "broadcast",
    event: "customer_added",
  });

  return { customer, availability };
};

const removeCustomer = async customer => {
  // console.log("removeCustomer", customer);

  // 1. remove customer availability
  const { data: removedAvailability, err } = await supabase
    .from("customer_availability")
    .delete()
    .match({ customer_id: customer.id })
    .select();
  if (err) return console.log(err);

  // 2. remove customer appointments
  const { data: removedAppointments, error: err1 } = await supabase
    .from("realtime_appointments")
    .delete()
    .match({ customer_id: customer.id })
    .select();
  if (err1) return console.log(err1);

  // 3. patch status of affected professional_availabilities
  const availsToPatch = [];
  removedAppointments.forEach(appointment => {
    const { professional_id, day, time } = appointment;
    availsToPatch.push({ professional_id, day, time });
  });
  const [professionalIds, days, times] = [
    availsToPatch.map(o => o.professional_id),
    availsToPatch.map(o => o.day),
    availsToPatch.map(o => o.time),
  ];

  let updatedProfessionalAvails = null;
  if (professionalIds.length && days.length && times.length) {
    const { data: avaliData, error: err3 } = await supabase
      .from("professional_availability")
      .update({ status: "1" })
      .filter("professional_id", "in", `(${professionalIds})`)
      .filter("day", "in", `(${days})`)
      .filter("time", "in", `(${times})`)
      .select();

    if (err3) return console.log({ err3 });
    updatedProfessionalAvails = avaliData;
  }

  // 4. delete the damn customer! [THIS NEED TO COME BEFORE LAMBDA CALL]
  const { data: deletedCustomer, error } = await supabase.from("customers").delete().eq("id", customer.id).select();
  if (error) return console.log({ error });

  // 5. delete user from auth.users
  const res = await fetch(`${LAMBDA_URL}/delete-customer`, {
    method: "POST",
    body: JSON.stringify({ customer }),
  });

  const data = await res.json();
  // console.log({ res, data, deletedCustomer });

  // console.log("removeCustomer", {
  //   deletedCustomer,
  //   // deletedUser,
  //   user,
  //   removedAppointments,
  //   removedAvailability,
  //   updatedProfessionalAvails,
  //   availsToPatch,
  //   days,
  //   professionalIds,
  //   times,
  // });

  channel.send({
    type: "broadcast",
    event: "customer_removed",
  });

  // return deletedCustomer[0];
};

const updateCustomer = async (id, values) => {
  // console.log("updateCustomer", { id, values });
  const { data, error } = await supabase
    .from("customers")
    .update({
      ...values,
      ...(values.date_of_birth && { date_of_birth: dateStrToDBDate(values.date_of_birth) }),
    })
    .eq("id", id);
  if (error) return error;

  // console.log("updateCustomer", { data, error });
  return data;
};

const updateProfessional = async (id, values) => {
  console.log("updateProfessional", { id, values });
  const { data, error } = await supabase
    .from("professionals")
    .update({
      ...values,
      ...(values.date_of_birth && { date_of_birth: dateStrToDBDate(values.date_of_birth) }),
    })
    .eq("id", id);
  if (error) return error;

  // console.log("updateProfessional", { data, error });
  return data;
};

const createAppointmentOffers = async (customerId, offers) => {
  // if (!offers.length) {
  //   return console.log("createAppointmentOffers with no offers! Abort it", { offers, customerId });
  // }

  // remove previous offers made to customer
  const { data: deletedData, error: deleteError } = await supabase
    .from("appointment_offers")
    .delete()
    .eq("customer_id", customerId)
    .select();

  const { data, insertError } = await supabase.from("appointment_offers").insert(offers).select();

  if (deleteError || insertError) return console.log({ deleteError, insertError });

  channel.send({
    type: "broadcast",
    event: `appointment_offers_updated`,
  });

  setTimeout(() => {
    channel.send({
      type: "broadcast",
      event: `${customerId}::appointment_offers_updated`,
    });
  }, 500);

  // console.log("appointment offer created", { data, deletedData });
};

// CREATE APPOINTMENT
const confirmOffer = async offer => {
  // console.log("confirmOffer", { offer });

  const { data: appointments, error } = await supabase.rpc("fn_create_first_appointment", {
    customer_id: offer.customer_id,
    professional_id: offer.professional_id,
    day: offer.day,
    hour: offer.time,
    datetime: offer.ISODate,
  });

  console.log();

  if (error) {
    console.log({ error });
    throw new Error(error.message);
  }

  channel.send({
    type: "broadcast",
    event: `${offer.professional_id}::appointments`,
  });

  setTimeout(() => {
    channel.send({
      type: "broadcast",
      event: `new_appointment_created`,
    });
  }, 500);

  return { appointments };
};

const updatePersonAvailability = async (person, role, newAvailability) => {
  const { data: initialAvailability } = await supabase
    .from(`${role}_availability`)
    .select("*")
    .eq(`${role}_id`, person.id);
  // console.log("updatePersonAvailability", { person, role, newAvailability, initialAvailability });

  const initialAvObj = {};
  const newAvObj = {};
  initialAvailability.forEach(av => {
    initialAvObj[`${av.day}::${av.time}`] = av;
  });
  newAvailability.forEach(av => {
    newAvObj[`${av.day}::${av.time}`] = av;
  });

  const toRemove = [];
  const toAdd = [];
  initialAvailability.forEach(av => {
    if (!newAvObj[`${av.day}::${av.time}`]) {
      // console.log("remove this", av);
      toRemove.push(av);
    }
  });
  newAvailability.forEach(av => {
    if (!initialAvObj[`${av.day}::${av.time}`]) {
      // console.log("add this", av);
      toAdd.push(av);
    }
  });

  const { data: prunedAvailability, error: deleteError } = await supabase
    .from(`${role}_availability`)
    .delete()
    .filter("id", "in", `(${toRemove.map(o => o.id)})`)
    .select();
  if (deleteError) return console.log({ deleteError });

  const { data: finalAvailability, error: insertError } = await supabase
    .from(`${role}_availability`)
    .insert(toAdd)
    .select();
  if (insertError) return console.log({ insertError });

  channel.send({
    type: "broadcast",
    event: `${person.id}::${role}_availability_updated`,
  });

  // looks like we need the timeout, otherwise, event doesn't get sent
  setTimeout(() => {
    channel.send({
      type: "broadcast",
      event: "person_availability_updated",
    });
  }, 500);

  // console.log(
  //   { prunedAvailability, newAvailability, finalAvailability },
  //   `${role}s_availability_updated`,
  //   `${person.id}::person_availability_updated`,
  //   `${person.id}::${role}_availability_updated`
  // );

  return { finalAvailability };
};

export {
  insertStaff,
  removeStaff,
  insertProfessional,
  removeProfessional,
  insertCustomer,
  removeCustomer,
  createAppointmentOffers,
  updatePersonAvailability,
  createUser,
  updateCustomer,
  updateProfessional,
  confirmOffer,
};
