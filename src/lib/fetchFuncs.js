import { supabase } from "../supabaseClient";

// all customers and all professionals
const fetchAdminData = async () => {
  const { data: customers, error: cError } = await supabase.from("customers").select("*");
  const { data: professionals, error: pError } = await supabase.from("professionals").select("*");

  if (cError || pError) return console.log({ cError, pError });

  return { customers, professionals };
};

// prof & customers count
const fetchAdminCountsData = async () => {
  const { count: customers_count, error: cError } = await supabase
    .from("customers")
    .select("*", { count: "exact" });
  const { count: professionals_count, error: pError } = await supabase
    .from("professionals")
    .select("*", { count: "exact" });
  const { count: staff_count, error: sError } = await supabase.from("staff").select("*", { count: "exact" });

  if (cError || pError || sError) return console.log({ cError, pError, sError });

  return { customers_count, professionals_count, staff_count };
};

const fetchCustomersData = async () => {
  const { data, error: cError } = await supabase.from("customers").select("*");

  if (cError) return console.log({ cError });

  return { customers: data };
};

const fetchCustomerData = async id => {
  const { data, error } = await supabase
    .from("customers")
    .select(`*, availability:customer_availability (*)`)
    .eq("id", id);

  //  availability:customer_availability ( id, day, time, status ),
  //       appointments:realtime_appointments ( id, professional_id, day, time, datetime, status ),
  //       appointmentOffers:appointment_offers ( id, day, time, professional_id )`

  if (error) return console.log({ error });

  return { customer: data[0] };
};

const fetchStaffData = async () => {
  const { data, error: sError } = await supabase.from("staff").select("*");

  const staffEmails = {};
  data.forEach(d => (staffEmails[d.email] = d.email));

  const { data: professionals, error: pError } = await supabase
    .from("professionals")
    .select("*")
    .filter("email", "in", `(${Object.keys(staffEmails)})`);

  if (sError || pError) return console.log({ pError, sError });

  const professionalsObj = {};
  professionals.forEach(p => (professionalsObj[p.email] = p));

  const staff = data.map(s =>
    professionalsObj[s.email]
      ? { ...s, isRegistered: true, professional: professionalsObj[s.email] }
      : { ...s, isRegistered: false, professional: null }
  );

  return { staff };
};

const fetchProfessionalsData = async () => {
  const { data: professionals, error: pError } = await supabase.from("professionals").select("*");
  if (pError) return console.log({ pError });

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

  const professional = data[0];

  if (professional.appointments) {
    const customersIds = professional.appointments.map(a => a.customer_id);

    const { customers } = await fetchCustomersId(customersIds);

    professional.appointments.forEach((a, i) => {
      const customer = customers.find(c => customersIds.includes(c.id));
      professional.appointments[i].customer = customer;
    });
  }

  if (error) return console.log({ error });

  console.log({ data });

  return { professional };
};

const fetchAppointmentsData = async () => {
  const { data, error } = await supabase.from("realtime_appointments").select("*");
  if (error) return console.log({ error });
  return { data };
};

const fetchCustomersId = async ids => {
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .filter("id", "in", `(${ids})`);
  if (error) return console.log({ error });
  return { customers };
};

// const fetchAppointmentsByCustomerIds = async ids => {
//   const { data: appointments, error } = await supabase
//     .from("realtime_appointments")
//     .select("*")
//     .filter("customer_id", "in", `(${ids})`);
//   if (error) return console.log({ error });
//   return { appointments };
// };

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
  fetchAdminData,
  fetchAdminCountsData,
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
