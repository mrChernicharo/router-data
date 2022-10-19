import { supabase } from "./supabaseClient";

// ************ HELPERS ************

// const fetchCustomersId = async ids => {
//   const { data: customers, error } = await supabase
//     .from("customers")
//     .select("*")
//     .filter("id", "in", `(${ids})`);
//   if (error) return console.log({ error });
//   return { customers };
// };

const fetchProfessionalsId = async ids => {
  const { data: professionals, error } = await supabase
    .from("professionals")
    .select("*")
    .filter("id", "in", `(${ids})`);
  if (error) return console.log({ error });
  return { professionals };
};

// ************ PAGE FETCHERS ************

const fetchLoginFakeData = async () => {
  const { data: customers, error: cError } = await supabase.from("customers").select("id, name");

  const { data: professionals, error: pError } = await supabase.from("professionals").select("id, name");

  if (cError || pError) return console.log({ cError, pError });

  console.log({ customers, professionals });

  return { customers, professionals };
};

const fetchAdminData = async () => {
  const { data: adminData, error } = await supabase.from("vw_admin_page").select("*");
  if (error) return console.log({ error });
  const data = adminData[0];
  console.log("fetchAdminData", { data });

  return data;
};

const fetchStaffData = async () => {
  const { data, error: sError } = await supabase.from("vw_staff_page").select("*");
  if (sError) return console.log({ sError });

  const staff = [];
  for (const d of data) {
    const { professional_email, professional_id, professional_name, staff_email, staff_id, staff_name } = d;

    const professional = professional_id
      ? {
          id: professional_id,
          name: professional_name,
          email: professional_email,
        }
      : null;

    staff.push({
      id: staff_id,
      name: staff_name,
      email: staff_email,
      isRegistered: !!professional,
      professional,
    });
  }

  console.log("fetchStaffData", { staff });
  return { staff };
};


const fetchAdminRequestsData = async () => {
  const { data: customers, error } = await supabase.from("vw_appointment_request_page").select("*");

  if (error) return console.log({ error });
  console.log("fetchAdminRequestsData", { customers });
  return { customers };
};

const fetchCustomerRequestAvailability = async id => {
  const { data: offers, error: oErr } = await supabase
    .from("appointment_offers")
    // .select("*, prof_slot:professional_availability ( id ), customer_slot:customer_availability ( id )")
    .select("*")
    .eq("customer_id", id);

  const { data: slots, error: mErr } = await supabase
    .rpc("fn_get_appointment_possibilities", { id })
    .select(
      "*, prof_slots:professional_availability ( id, day, time ), customer_slots:customer_availability ( id, day, time )"
    );

  if (mErr || oErr) return console.log(mErr || oErr);

  const matches = [];
  for (let item of slots) {
    const { time, day } = item;

    const professional_availability_slot = item.prof_slots.find(s => s.time === time && s.day === day);
    const customer_availability_slot = item.customer_slots.find(s => s.time === time && s.day === day);

    if (professional_availability_slot) {
      // this feels wonky: our DB function should not return slots that have no matching prof_av...but this check here does the trick
      delete item.prof_slots;
      delete item.customer_slots;
      matches.push({
        ...item,
        customer_availability_slot_id: customer_availability_slot.id,
        professional_availability_slot_id: professional_availability_slot.id,
      });
    }
  }

  console.log("fetchCustomerRequestAvailability", { slots, matches, offers });

  return { matches, offers };
};

const fetchCustomersData = async () => {
  const { data, error: cError } = await supabase.from("customers").select("*");

  if (cError) return console.log({ cError });

  return { customers: data };
};

const fetchCustomerData = async id => {
  const { data, error } = await supabase
    .from("customers")
    .select(
      `*,
      availability:customer_availability (*),
      appointments:realtime_appointments ( id, professional_id, day, time, datetime, status )`
    )
    .eq("id", id);

  const {data: offers, error: oErr} = await supabase.from('appointment_offers').select('*').eq('customer_id', id)  

  if (error) return console.log({ error });

  const customer = data[0];
  // console.log('KUSTOMERRRR', customer)
  
  if (customer.appointments) {
    const professionalsIds = customer.appointments.map(a => a.professional_id);
    const { professionals } = await fetchProfessionalsId(professionalsIds);

    customer.appointments.forEach((a, i) => {
      const professional = professionals.find(c => professionalsIds.includes(c.id));

      delete customer.appointments[i].professional_id;
      customer.appointments[i].professional = professional;
    });
  }

  if (offers) {
    const professionalsIds = offers.map(a => a.professional_id);
    const { professionals } = await fetchProfessionalsId(professionalsIds);

    offers.forEach((o, i) => {
      const professional = professionals.find(p => p.id === o.professional_id);

      offers[i].professional = professional;
    });

    customer.offers = offers
  }

  console.log("fetchCustomerData", { customer });

  return { customer };
};

const fetchProfessionalsData = async () => {
  const { data: professionals, error: pError } = await supabase.from("professionals").select("*");
  if (pError) return console.log({ pError });
  console.log({ professionals });
  return { professionals };
};


const fetchProfessionalData = async id => {
  const { data, error } = await supabase
    .from("professionals")
    .select(
      `*, 
      availability:professional_availability (*),
      appointments:realtime_appointments ( id, customer_id, day, time, datetime, status )`
    )
    .eq("id", id);

  if (error) return console.log({ error });

  const professional = data[0];

  if (!professional.appointments?.length)  return { professional };
  
  const customersProms = [];
  for (let appointment of professional.appointments) {
    customersProms.push(supabase.from("customers").select("*").eq("id", appointment.customer_id));
  }

  const results = await Promise.all(customersProms);

  for (let [i, res] of results.entries()) {
    const customer = res.data[0];

    delete professional.appointments[i].customer_id;
    professional.appointments[i].customer = customer;
  }
  

  console.log("fetchProfessionalData", { professional });

  return { professional };
};

const fetchAppointmentsData = async () => {
  const { data, error } = await supabase.from("realtime_appointments").select("*");
  if (error) return console.log({ error });
  return { data };
};

const fetchAppointmentData = async id => {
  const { data, error } = await supabase.from("realtime_appointments").select("*").eq("id", id);
  if (error) return console.log({ error });
  return { data };
};

const fetchCustomerAvailability = async () => {
  const { data, error } = await supabase.from("customer_availability").select("*");
  if (error) return console.log({ error });
  return { data };
};
const fetchProfessionalAvailability = async () => {
  const { data, error } = await supabase.from("professional_availability").select("*");
  if (error) return console.log({ error });
  return { data };
};
const fetchRealtimeAppointments = async () => {
  const { data, error } = await supabase.from("realtime_appointments").select("*");
  if (error) return console.log({ error });
  return { data };
};

const fetchAppointmentOffers = async () => {
  const { data, error } = await supabase.from("appointment_offers").select("*");
  if (error) return console.log({ error });

  return { data };
};

export {
  fetchLoginFakeData,
  fetchAdminData,
  fetchAdminRequestsData,
  fetchCustomerRequestAvailability,
  fetchCustomerData,
  fetchCustomersData,
  fetchProfessionalsData,
  fetchStaffData,
  fetchProfessionalData,
  fetchAppointmentsData,
  fetchAppointmentData,
  fetchCustomerAvailability,
  fetchProfessionalAvailability,
  fetchRealtimeAppointments,
  fetchAppointmentOffers,
};
