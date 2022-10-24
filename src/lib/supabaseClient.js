import { createClient } from "@supabase/supabase-js";

<<<<<<< HEAD
const { VITE_PROJECT_URL, VITE_ANON_PUB, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = import.meta.env;
=======
const supabaseUrl = import.meta.env.VITE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_ANON_PUB;
>>>>>>> a95f835 (calling some netlify funcs on login mount)

export const supabase = createClient(VITE_PROJECT_URL, VITE_ANON_PUB, {
  global: {},
  auth: {},
  db: {},
  realtime: {},
});

export const channel = supabase.channel("my_db");

channel.subscribe(status => {
  console.log({ status });
});

export const getSupabaseAdmin = () => {
  try {
    const client = () => createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE);

    return client();
  } catch (err) {
    return err;
  }
};
