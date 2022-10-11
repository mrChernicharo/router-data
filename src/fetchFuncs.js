import { supabase } from "./supabaseClient";

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

  if (cError || pError) return console.log({ cError, pError });

  return { customers_count, professionals_count };
};

const fetchCustomersData = async () => {
  const { data: customers, error: cError } = await supabase.from("customers").select("*");

  if (cError) return console.log({ cError });

  return { customers };
};

const fetchProfessionalsData = async () => {
  const { data: professionals, error: pError } = await supabase.from("professionals").select("*");

  if (pError) return console.log({ pError });

  return { professionals };
};

export { fetchAdminData, fetchAdminCountsData, fetchCustomersData, fetchProfessionalsData };
