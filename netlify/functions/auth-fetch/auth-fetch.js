// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const { createClient } = require("@supabase/supabase-js");

const { VITE_PROJECT_URL, VITE_ANON_PUB, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = process.env;

const handler = async function (event, context) {
  try {
  
    
    const supabaseAdmin = createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE);

   

    // works!
    // const { data, error } = await supabaseAdmin.auth.admin.deleteUser();

    
    // DOESN'T WORK: normal client with auth.users 
    // const {data, error} = await supabase.from('auth.users').select('*');

    // this works!

    // const { data: del, error: err } = await supabaseAdmin.auth.admin.deleteUser('4d52e6e9-06ae-4fc3-bf22-b24582e4bfcc')


    // just not in prod
    
    // '502fd897-5eed-42dd-9278-fa8f1d4cdcb1'


    return {
      statusCode: 200,
      // body: JSON.stringify({ data, error }),
      body: JSON.stringify({ event, context }),
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
