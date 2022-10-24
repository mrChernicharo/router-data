const { VITE_PROJECT_URL, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = process.env;

const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event, context) => {
  const adminSupabase = createClient(VITE_PROJECT_URL, VITE_SUPABASE_KEY, VITE_SERVICE_ROLE);

  const users = await adminSupabase.auth.admin.listUsers();

  return {
    statusCode: 200,
    body: JSON.stringify({ event, context, hello: "holla mundo!", users }),
  };
};
