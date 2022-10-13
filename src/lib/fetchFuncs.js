import { supabase } from "../supabaseClient";

const fetchLoginFakeData = async () => {
  const { data: customers, error: cError } = await supabase.from("customers").select("id, name");

  const { data: professionals, error: pError } = await supabase.from("professionals").select("id, name");

  if (cError || pError) return console.log({ cError, pError });

  console.log({ customers, professionals });

  return { customers, professionals };
};

// staff & prof & customers count
const fetchAdminData = async () => {
  const {
    data: customersIds,
    count: customers_count,
    error: cIdError,
  } = await supabase.from("customers").select("id");

  const {
    data: professionals,
    count: professionals_count,
    error: pError,
  } = await supabase.from("professionals").select("id, name", { count: "exact" });

  const { count: staff_count, error: sError } = await supabase.from("staff").select("id", { count: "exact" });

  const { data: all_customers, error: cError } = await supabase
    .from("customers")
    .select(
      `id, name, 
      offers:appointment_offers( * ),
      appointments:realtime_appointments ( id )`
    )
    .filter("id", "in", `(${customersIds.map(c => c.id)})`);

  console.log(all_customers);

  const [unattended_customers, customers_with_offers, customers_with_appointments] = [
    all_customers.filter(c => !c.appointments.length && !c.offers.length), // red
    all_customers.filter(c => c.offers.length), // yellow
    all_customers.filter(c => c.appointments.length), // ok!
  ];

  const customers_with_offers_with_profs = customers_with_offers.map(customer => ({
    ...customer,
    offers: customer.offers.map(offer => ({
      ...offer,
      professional: professionals.find(p => p.id === offer.professional_id).name,
    })),
  }));

  if (cIdError | cError || pError || sError) return console.log({ cError, pError, sError });

  return {
    customers_count,
    professionals_count,
    staff_count,
    // all_customers,
    unattended_customers,
    customers_with_offers,
    customers_with_offers_with_profs,
  };
};

const fetchAdminRequestsData = async () => {
  const { data: customers, error: cError } = await supabase
    .from("customers")
    .select(
      "*, availability:customer_availability(*), offers:appointment_offers(*), appointments:realtime_appointments ( id )"
    );

  const { data: professionals, error: pError } = await supabase
    .from("professionals")
    .select("*, availability:professional_availability(*)");

  const customerPossibilities = {};
  customers.forEach(customer => {
    customerPossibilities[customer.id] = {};

    customer.availability.forEach(c_av => {
      if (!(c_av.day in customerPossibilities[customer.id]))
        customerPossibilities[customer.id][c_av.day] = [];

      customerPossibilities[customer.id][c_av.day].push(c_av);
    });
  });

  const possibilities = {}; // by customer / day / professional
  customers.forEach(customer => {
    possibilities[customer.id] = [];
    professionals.forEach(prof => {
      const commonProfAvailability = prof.availability.filter(
        p_av =>
          p_av.status === "1" &&
          p_av.day in customerPossibilities[customer.id] &&
          customerPossibilities[customer.id][p_av.day].find(o => o.time === p_av.time)
      );
      possibilities[customer.id].push(commonProfAvailability);
    });
  });

  if (cError || pError) return console.log({ cError, pError });
  console.log("haaa", { customerPossibilities, possibilities, p: possibilities[customers[0].id] });

  const [unattended_customers, customers_with_offers, customers_with_appointments] = [
    customers.filter(c => !c.appointments.length && !c.offers.length), // red
    customers.filter(c => c.offers.length), // yellow
    customers.filter(c => c.appointments.length), // ok!
  ];

  return {
    customers,
    professionals,
    possibilities,
    unattended_customers,
    customers_with_offers,
    customers_with_appointments,
  };

  // const {
  //   data: customersIds,
  //   count: customers_count,
  //   error: cIdError,
  // } = await supabase.from("customers").select("id");

  // const {
  //   data: professionals,
  //   count: professionals_count,
  //   error: pError,
  // } = await supabase.from("professionals").select("id, name", { count: "exact" });

  // const { count: staff_count, error: sError } = await supabase.from("staff").select("id", { count: "exact" });

  // const { data: all_customers, error: cError } = await supabase
  //   .from("customers")
  //   .select(
  //     `id, name,
  //     offers:appointment_offers( * ),
  //     appointments:realtime_appointments ( id )`
  //   )
  //   .filter("id", "in", `(${customersIds.map(c => c.id)})`);

  // console.log(all_customers);

  // const [unattended_customers, customers_with_offers, customers_with_appointments] = [
  //   all_customers.filter(c => !c.appointments.length && !c.offers.length), // red
  //   all_customers.filter(c => c.offers.length), // yellow
  //   all_customers.filter(c => c.appointments.length), // ok!
  // ];

  // const customers_with_offers_with_profs = customers_with_offers.map(customer => ({
  //   ...customer,
  //   offers: customer.offers.map(offer => ({
  //     ...offer,
  //     professional: professionals.find(p => p.id === offer.professional_id).name,
  //   })),
  // }));

  // if (cIdError | cError || pError || sError) return console.log({ cError, pError, sError });

  // return {
  //   customers_count,
  //   professionals_count,
  //   staff_count,
  //   // all_customers,
  //   unattended_customers,
  //   customers_with_offers,
  //   customers_with_offers_with_profs,
  // };
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
      offers:appointment_offers(*),
      appointments:realtime_appointments ( id, professional_id, day, time, datetime, status )`
    )
    .eq("id", id);

  if (error) return console.log({ error });

  const customer = data[0];

  if (customer.appointments) {
    const professionalsIds = customer.appointments.map(a => a.professional_id);

    const { professionals } = await fetchProfessionalsId(professionalsIds);

    customer.appointments.forEach((a, i) => {
      const professional = professionals.find(c => professionalsIds.includes(c.id));
      customer.appointments[i].professional = professional;
    });
  }

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
      availability:appointment_offers (*),
      appointments:realtime_appointments ( id, customer_id, day, time, datetime, status )`
    )
    .eq("id", id);

  const professional = data[0];

  if (professional.appointments) {
    const professionalsIds = professional.appointments.map(a => a.customer_id);

    const { customers } = await fetchCustomersId(professionalsIds);

    professional.appointments.forEach((a, i) => {
      const customer = customers.find(c => professionalsIds.includes(c.id));
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

const fetchProfessionalsId = async ids => {
  const { data: professionals, error } = await supabase
    .from("professionals")
    .select("*")
    .filter("id", "in", `(${ids})`);
  if (error) return console.log({ error });
  return { professionals };
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
  fetchLoginFakeData,
  fetchAdminData,
  fetchAdminRequestsData,
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
