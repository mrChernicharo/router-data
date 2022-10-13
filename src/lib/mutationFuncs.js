import { supabase } from "./supabaseClient";
import { DEFAULT_PROFESSIONAL_AVAILABILITY } from "./constants";

const insertStaff = async ({ name, email }) => {
  console.log("insertStaff", { name, email });
  const { data, error } = await supabase.from("staff").insert([{ name, email }]).select();
  if (error) return console.log(error);

  const staff = data[0];
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
  return { entry };
};

const insertProfessional = async ({ name, email }) => {
  const { data, error } = await supabase.from("professionals").insert([{ name, email }]).select();
  if (error) return console.log(error);

  const professionalAvailability = DEFAULT_PROFESSIONAL_AVAILABILITY.map(o => ({
    ...o,
    professional_id: data[0].id,
    status: "1",
  }));

  const { data: availability, error: err2 } = await supabase
    .from("professional_availability")
    .insert(professionalAvailability)
    .select();
  if (err2) return console.log(err2);

  const entry = { ...data[0], availability, appointments: [] };

  console.log("insertProfessional", { entry });

  return entry;
};

const removeProfessional = async id => {
  console.log("remove", { id });
  // 1. remove professional availability slots
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
  const { data: deletedProfessional, error } = await supabase
    .from("professionals")
    .delete()
    .match({ id })
    .select();
  if (error) return console.log(error);

  console.log({
    deletedProfessional,
    removedAppointments,
    removedProfessionalAvailability,
    updatedCustomerAvails,
    availsToPatch,
    customerIds,
    days,
    times,
  });

  return deletedProfessional[0];
};

const insertCustomer = async person => {
  console.log("insertCustomer", person);

  // const { data, error } = await supabase.from("customers").insert([{ name, email }]).select();
  // if (error) return console.log(error);

  // const customerAvailability = DEFAULT_CUSTOMER_AVAILABILITY.map((o) => ({
  //   ...o,
  //   customer_id: data[0].id,
  //   status: "1",
  // }));

  // const { data: availability, error: err2 } = await supabase
  //   .from("customer_availability")
  //   .insert(customerAvailability)
  //   .select();
  // if (err2) return console.log(err2);

  // const entry = { ...data[0], availability, appointments: [], appointmentOffers: [] };

  // console.log("addCustomer", { entry });
  // setStore("customers", (prev) => [...prev, entry]);

  // channel.send({
  //   type: "broadcast",
  //   event: "customer_added",
  //   entry,
  // });

  // return entry;
};

const removeCustomer = async person => {
  console.log("removeCustomer", person);

  //  // 1. remove customer availability
  // const { data: removedAvailability, err } = await supabase
  //   .from("customer_availability")
  //   .delete()
  //   .match({ customer_id: id })
  //   .select();
  // if (err) return console.log(err);

  // // 2. remove customer appointments
  // const { data: removedAppointments, error: err1 } = await supabase
  //   .from("realtime_appointments")
  //   .delete()
  //   .match({ customer_id: id })
  //   .select();
  // if (err1) return console.log(err1);

  // // 3. patch status of affected professional_availabilities
  // const availsToPatch = [];
  // removedAppointments.forEach(appointment => {
  //   const { professional_id, day, time } = appointment;
  //   availsToPatch.push({ professional_id, day, time });
  // });
  // const [professionalIds, days, times] = [
  //   availsToPatch.map(o => o.professional_id),
  //   availsToPatch.map(o => o.day),
  //   availsToPatch.map(o => o.time),
  // ];

  // let updatedProfessionalAvails = null;
  // if (store.professionals.length && professionalIds.length && days.length && times.length) {
  //   const { data: avaliData, error: err3 } = await supabase
  //     .from("professional_availability")
  //     .update({ status: "1" })
  //     .filter("professional_id", "in", `(${professionalIds})`)
  //     .filter("day", "in", `(${days})`)
  //     .filter("time", "in", `(${times})`)
  //     .select();

  //   if (err3) return console.log({ err3 });
  //   updatedProfessionalAvails = avaliData;
  // }

  // // 4. delete the damn customer!
  // const { data: deletedCustomer, error } = await supabase.from("customers").delete().match({ id }).select();
  // if (error) return console.log(error);

  // console.log("removeCustomer", {
  //   deletedCustomer,
  //   removedAppointments,
  //   removedAvailability,
  //   updatedProfessionalAvails,
  //   availsToPatch,
  //   days,
  //   professionalIds,
  //   times,
  // });

  // return deletedCustomer[0];
};

const createAppointmentOffers = async (customerId, offers) => {
  // if (!offers.length) {
  //   return console.log("createAppointmentOffers with no offers! Abort it", { offers, customerId });
  // }
  console.log("createAppointmentOffers", { offers, customerId });

  // // patch/remove previous offers
  const { data: deletedData, error: deleteError } = await supabase
    .from("appointment_offers")
    .delete()
    .eq("customer_id", customerId)
    .select();

  const { data, insertError } = await supabase.from("appointment_offers").insert(offers).select();

  if (deleteError || insertError) return console.log({ deleteError, insertError });

  console.log("appointment offer created", { data, deletedData });

  // // channel.send({
  // //   type: "broadcast",
  // //   event: "appointment_offer_created",
  // //   customerId,
  // //   entries: data,
  // // });

  // console.log({ data, deletedData });

  // return data
};

export {
  insertStaff,
  removeStaff,
  insertProfessional,
  removeProfessional,
  insertCustomer,
  removeCustomer,
  createAppointmentOffers,
};
