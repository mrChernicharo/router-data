

exports.handler = async  (event, context)  => {

    event = event || {};

    return {
        statusCode: 200,
        body: JSON.stringify({ event, context, hello: 'holla mundo!' }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
    }

};