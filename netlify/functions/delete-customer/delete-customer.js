const { createClient } = require("@supabase/supabase-js");

const { VITE_PROJECT_URL, VITE_ANON_PUB, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = process.env;

const handler = async function (event, context) {
  try {
    // if (event.httpMethod !== "POST") return { statusCode: 400, body: "Must POST to this function" };

    const supabaseAdmin = createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE);
    const { customer } = JSON.parse(event.body);

    console.log({ customer, a: customer.auth_id });
    const res = await supabaseAdmin.auth.admin.deleteUser(customer.auth_id);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify({ msg: "just deleted this motherfucker!", ...customer }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
