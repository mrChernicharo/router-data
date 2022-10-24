
const { VITE_PROJECT_URL, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = process.env;

const { createClient } = require("@supabase/supabase-js");

const adminSupabase = createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE, {
  global: {},
  auth: {},
  db: {},
  realtime: {},
});


exports.handler = async (event, context) => {
  const users = await adminSupabase.auth.admin.listUsers();

  return {
    statusCode: 200,
    body: JSON.stringify({ event, context, hello: "holla mundo!", users }),
  };
};
