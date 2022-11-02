import { LAMBDA_URL } from "./constants";
import { DBDateToDateStr } from "./helpers";
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

const fetchAuthState = async () => {
  const { data: authData, error } = await supabase.auth.getSession();
  return authData;
};

// ************ PAGE FETCHERS ************

const fetchLoginFakeData = async () => {
  const { data: customers, error: cError } = await supabase.from("customers").select("id, first_name");

  const { data: professionals, error: pError } = await supabase.from("professionals").select("id, first_name");

  if (cError || pError) return console.log({ cError, pError });

  console.log('fetchLoginFakeData',{ customers, professionals });

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

  const { registeredEmails } = await fetch(`${LAMBDA_URL}/get-registered-users`).then(async res => await res.json());

  const staff = [];
  for (const d of data) {
    const { professional_email, professional_id, category, staff_email, staff_id, staff_name } = d;

    const professional = professional_id
      ? {
          id: professional_id,
          category,
          email: professional_email,
        }
      : null;

    staff.push({
      id: staff_id,
      email: staff_email,
      category,
      isRegistered: registeredEmails.includes(staff_email),
      professional
    });
  }

  console.log("fetchStaffData", { staff, registeredEmails });
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
      "*, prof_slots:professional_availability ( id, day, time, status ), customer_slots:customer_availability ( id, day, time, status )"
    );

  if (mErr || oErr) return console.log(mErr || oErr);

  const matches = [];
  for (let [i, item] of slots.entries()) {
    const { time, day } = item;
    // console.log({ i, item });

    const professional_availability_slot = item.prof_slots.find(
      s => s.time === time && s.day === day && s.status !== "0"
    );
    const customer_availability_slot = item.customer_slots.find(
      s => s.time === time && s.day === day && s.status !== "0"
    );

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

  const { data: offers, error: oErr } = await supabase.from("appointment_offers").select("*").eq("customer_id", id);

  if (error || oErr) return console.log({ error, oErr });

  const customer = data[0];
  if (!customer) throw new Error("Customer missing");

  customer.date_of_birth = customer.date_of_birth ? DBDateToDateStr(customer.date_of_birth) : '';

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

    customer.offers = offers;
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
  professional.date_of_birth = professional.date_of_birth ? DBDateToDateStr(professional.date_of_birth) : '';


  if (!professional?.appointments?.length) return { professional };

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

export {
  fetchAuthState,
  fetchLoginFakeData,
  fetchAdminData,
  fetchAdminRequestsData,
  fetchCustomerRequestAvailability,
  fetchCustomerData,
  fetchCustomersData,
  fetchProfessionalsData,
  fetchStaffData,
  fetchProfessionalData,
};
