// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const { createClient } = require("@supabase/supabase-js");

const { VITE_PROJECT_URL, VITE_ANON_PUB, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = process.env;

const handler = async function (event, context) {
  try {
    // const supabaseAdmin = createClient(VITE_PROJECT_URL, VITE_SUPABASE_KEY, {
    //   service_role: VITE_SERVICE_ROLE,
    //   service_role_key: VITE_SERVICE_ROLE,
    //   serviceRoleKey: VITE_SERVICE_ROLE,
    //   serviceRole: VITE_SERVICE_ROLE,
    // });
    const supabaseAdmin = createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY);
    // const supabaseAdmin = createClient(VITE_PROJECT_URL,  VITE_SERVICE_ROLE, {
    //   auth: {
    //     storageKey: VITE_SUPABASE_KEY
    //   },
    //   supabaseKey: VITE_SUPABASE_KEY
    // });
    // const supabaseAdmin = createClient(VITE_PROJECT_URL, { apiKey: VITE_SUPABASE_KEY, service_role: VITE_SERVICE_ROLE });
    

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();


    return {
      statusCode: 200,
      body: JSON.stringify({ data, error }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "Application/json",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ ...error }),
    };
  }
};

module.exports = { handler };
