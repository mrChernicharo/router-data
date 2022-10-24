import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_ANON_PUB;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {},
  auth: {},
  db: {},
  realtime: {},
});

export const channel = supabase.channel("my_db");

channel.subscribe(status => {
  console.log({ status });
});


// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)