const { schedule } = require("@netlify/functions");
const { createClient } = require("@supabase/supabase-js");
const { parse, parseISO, addDays } = require("date-fns");

const { VITE_PROJECT_URL, VITE_ANON_PUB, VITE_SERVICE_ROLE, VITE_SUPABASE_KEY } = process.env;

const handler = async function (event, context) {
  const supabaseAdmin = createClient(VITE_PROJECT_URL, VITE_SERVICE_ROLE);
  const supabase = createClient(VITE_PROJECT_URL, VITE_ANON_PUB);

  const promises = [
    supabase.from("vw_retrieve_week_appointments").select("*"),
    supabase.from("vw_retrieve_next_week_appointments").select("*"),
    supabase.from("vw_retrieve_next_next_week_appointments").select("*"),
    supabase.from("vw_retrieve_next_next_next_week_appointments").select("*"),
    supabase.from("vw_retrieve_next_month_appointments").select("*"),
  ];

  const [
    { data: weekAppointments, error: err },
    { data: nextWeekAppointments, error: NErr },
    { data: nextNextWeekAppointments, error: NNErr },
    { data: nextNextNextWeekAppointments, error: NNNErr },
    { data: nextMonthAppointments, error: nMErr },
  ] = await Promise.all(promises);

  if (err || NErr || NNErr || NNNErr || nMErr) {
    console.log({ err, NErr, NNErr, NNNErr, nMErr });
    throw new Error("failed to fetch future week appointments!");
  }

  const hasFutureAppointment = (weekArray, appointment) => {
    return weekArray.find(
      app =>
        app.day === appointment.day &&
        app.time === appointment.time &&
        app.customer_id === appointment.customer_id &&
        app.professional_id === appointment.professional_id
    );
  };

  const createFutureAppointmentToInsert = (appointment, sumDays) => {
    const app = {
      ...appointment,
      datetime: addDays(
        new Date(new Date(appointment.datetime).setHours(+appointment.time.slice(0, 2), +appointment.time.slice(3, 5))),
        sumDays
      ),
    };
    delete app.id;

    return app;
  };

  const appointmentsToInsert = [];
  weekAppointments.forEach(app => {
    if (!hasFutureAppointment(nextWeekAppointments, app)) {
      appointmentsToInsert.push(createFutureAppointmentToInsert(app, 7));
    }
    if (!hasFutureAppointment(nextNextWeekAppointments, app)) {
      appointmentsToInsert.push(createFutureAppointmentToInsert(app, 14));
    }
    if (!hasFutureAppointment(nextNextWeekAppointments, app)) {
      appointmentsToInsert.push(createFutureAppointmentToInsert(app, 21));
    }
  });

  console.table({
    weekAppointments: weekAppointments.map(app => `${app.day}::${app.time}`),
    nextWeekAppointments: nextWeekAppointments.map(app => `${app.day}::${app.time}`),
    nextNextWeekAppointments: nextNextWeekAppointments.map(app => `${app.day}::${app.time}`),
    nextNextNextWeekAppointments: nextNextNextWeekAppointments.map(app => `${app.day}::${app.time}`),
    nextMonthAppointments: nextMonthAppointments.map(app => `${app.day}::${app.time}`),
  });

  console.log({ appointmentsToInsert });

  const { data: insertedAppointments, error } = await supabase
    .from("realtime_appointments")
    .insert(appointmentsToInsert)
    .select("*");

  if (error) {
    console.log({ error });
    throw new Error("failed to insert future week appointments!");
  }

  console.log({ insertedAppointments });

  return {
    statusCode: 200,
    // headers: {
    //   "Access-Control-Allow-Origin": "*", // Allow from anywhere
    // },
    // body: { message: "appointments sync OK!" },
  };
};

exports.handler = schedule("@hourly", handler);
