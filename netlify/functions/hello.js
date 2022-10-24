exports.handler = async  (event, context)  => {

    event = event || {};

    return {
        statusCode: 200,
        body: JSON.stringify({ event, context })
    }

};