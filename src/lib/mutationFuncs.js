import { supabase } from "../supabaseClient";

const insertStaff = async ({ name, email }) => {
  const { data, error } = await supabase.from("staff").insert([{ name, email }]).select();
  if (error) return console.log(error);

  const staff = data[0];
  return { staff };
};

export { insertStaff };
