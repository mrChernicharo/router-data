import { supabase } from "./supabaseClient";
import { DEFAULT_PROFESSIONAL_AVAILABILITY, DEFAULT_CUSTOMER_AVAILABILITY } from "./constants";

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
  console.log("removeProfessional", { id });
  // // 1. remove professional availability slots
  // const { data: removedProfessionalAvailability, error: err } = await supabase
  //   .from("professional_availability")
  //   .delete()
  //   .match({ professional_id: id })
  //   .select();
  // if (err) return console.log(err);

  // // 2. remove professional appointments
  // const { data: removedAppointments, error: err1 } = await supabase
  //   .from("realtime_appointments")
  //   .delete()
  //   .match({ professional_id: id })
  //   .select();
  // if (err1) return console.log(err1);

  // // 3. patch status of affected customer_availabilities
  // const availsToPatch = [];
  // removedAppointments.forEach(appointment => {
  //   const { customer_id, day, time } = appointment;
  //   availsToPatch.push({ customer_id, day, time });
  // });
  // const [customerIds, days, times] = [
  //   availsToPatch.map(o => o.customer_id),
  //   availsToPatch.map(o => o.day),
  //   availsToPatch.map(o => o.time),
  // ];

  // let updatedCustomerAvails = null;
  // if (customerIds.length && days.length && times.length) {
  //   const { data, error: err3 } = await supabase
  //     .from("customer_availability")
  //     .update({ status: "1" })
  //     .filter("customer_id", "in", `(${customerIds})`)
  //     .filter("day", "in", `(${days})`)
  //     .filter("time", "in", `(${times})`)
  //     .select();

  //   if (err3) return console.log({ err3 });
  //   updatedCustomerAvails = data;
  // }

  // // 4. delete professional!
  // const { data: deletedProfessional, error } = await supabase
  //   .from("professionals")
  //   .delete()
  //   .match({ id })
  //   .select();
  // if (error) return console.log(error);

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

  // return deletedProfessional[0];
};

const insertCustomer = async person => {
  const { data, error } = await supabase.from("customers").insert([person]).select();
  if (error) return console.log(error);

  const customer = data[0];
  const customerAvailability = DEFAULT_CUSTOMER_AVAILABILITY.map(o => ({
    ...o,
    customer_id: customer.id,
    status: "1",
  }));

  const { data: availability, error: err2 } = await supabase
    .from("customer_availability")
    .insert(customerAvailability)
    .select();
  if (err2) return console.log(err2);

  console.log("addCustomer", { customer, availability });


  // channel.send({
  //   type: "broadcast",
  //   event: "customer_added",
  //   entry,
  // });

  // return entry;
};

const removeCustomer = async id => {
  console.log("removeCustomer", id);

   // 1. remove customer availability
  const { data: removedAvailability, err } = await supabase
    .from("customer_availability")
    .delete()
    .match({ customer_id: id })
    .select();
  if (err) return console.log(err);

  // 2. remove customer appointments
  const { data: removedAppointments, error: err1 } = await supabase
    .from("realtime_appointments")
    .delete()
    .match({ customer_id: id })
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

  // 4. delete the damn customer!
  const { data: deletedCustomer, error } = await supabase.from("customers").delete().match({ id }).select();
  if (error) return console.log(error);

  console.log("removeCustomer", {
    deletedCustomer,
    removedAppointments,
    removedAvailability,
    updatedProfessionalAvails,
    availsToPatch,
    days,
    professionalIds,
    times,
  });

  return deletedCustomer[0];
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

  console.log("appointment offer created", { data, deletedData });
};

const confirmOffer = async (customerId, offer) => {
  console.log("confirmOffer", { customerId, offer });

  return {customerId, offer}
  // 1. clear same appointment_offer to other customers
  // const {data: ODeletedOffers, error: ODeleteError } = await supabase
  // .from("appointment_offers")
  // .delete()
  // .match({ professional_id: offer.professional.id, time: offer.time, day: offer.day })

  // // 1.5 clear all appointment_offers made to customer
  // const { data: CDeletedOffers, error: deleteOfferError } = await supabase
  //   .from("appointment_offers")
  //   .delete()
  //   .eq("customer_id", customerId)
  //   .select();
  // if (deleteOfferError) {
  //   console.log({ deleteOfferError });
  //   return;
  // }
  // // 2. patch customer availability (status)
  // const { data: updatedCustomerAvail, error: updateCAvError } = await supabase
  //   .from("customer_availability")
  //   .update({ status: "0" })
  //   .match({ customer_id: customerId, day: offer.day, time: offer.time })
  //   .select();
  // if (updateCAvError) {
  //   console.log({ updateCAvError });
  //   return;
  // }
  // // 3. professional availability (status)
  // const { data: updatedProfAvail, error: updatePAvError } = await supabase
  //   .from("professional_availability")
  //   .update({ status: "0" })
  //   .match({ professional_id: offer.professional.id, day: offer.day, time: offer.time })
  //   .select();
  // if (updatePAvError) {
  //   console.log({ updatePAvError });
  //   return;
  // }
  // const newAppointment = {
  //   customer_id: customerId,
  //   professional_id: offer.professional.id,
  //   day: offer.day,
  //   time: offer.time,
  //   datetime: offer.ISODate,
  //   status: "1",
  // };
  // // 4. create appointment 🎉
  // const { data, error: appointmentError } = await supabase
  //   .from("realtime_appointments")
  //   .insert(newAppointment)
  //   .select();
  // if (appointmentError) {
  //   console.log({ appointmentError });
  //   return;
  // }
  // await fetchServer();
  // channel.send({
  //   type: "broadcast",
  //   event: "appointment_offer_confirmed_by_customer",
  //   customerId,
  //   entry: offer,
  // });
};

const updatePersonAvailability = async (person, role, availability) => {
  console.log("updatePersonAvailability", { person, role, availability });

  const { data: oldAvailability, error: deleteError } = await supabase
    .from(`${role}_availability`)
    .delete()
    .match({ [`${role}_id`]: person.id })
    .select();
  if (deleteError) {
    console.log({ deleteError });
    return;
  }
  const { data: newAvailability, error: insertError } = await supabase
    .from(`${role}_availability`)
    .insert(availability)
    .select();
  if (insertError) {
    console.log({ insertError });
    return;
  }
  console.log({ oldAvailability, newAvailability });

  return { newAvailability };
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
  confirmOffer
};
