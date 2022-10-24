import { createClient } from "@supabase/supabase-js";



const {
  VITE_PROJECT_URL,
  VITE_ANON_PUB,
  VITE_SERVICE_ROLE,
  VITE_SUPABASE_KEY
} = import.meta.env

export const supabase = createClient(VITE_PROJECT_URL, VITE_ANON_PUB, {
  global: {},
  auth: {},
  db: {},
  realtime: {},
});

// export const supabaseAdmin = createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE)

export const channel = supabase.channel("my_db");

channel.subscribe(status => {
  console.log({ status });
});


