const { createClient } = require("@supabase/supabase-js");

const { VITE_PROJECT_URL, VITE_ANON_PUB, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = process.env;

const handler = async function (event, context) {
  try {
    const supabaseAdmin = createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE);
    const {data,error} = await supabaseAdmin.auth.admin.listUsers()

    const registeredEmails  = data.users.filter(u => u.email_confirmed_at).map(u => u.email)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify({ registeredEmails }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
