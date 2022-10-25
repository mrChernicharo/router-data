const fetch = require("node-fetch");

const handler = async (event, context, callback) => {
  try {
    // if (event.httpMethod !== "POST") return { statusCode: 400, body: "Must POST to this function" };

    const reqBody = JSON.parse(event.body);

    // console.log(context, event, data);


    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify({ msg: "hello", ...reqBody }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
