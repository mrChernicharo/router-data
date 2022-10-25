bring tailwind (and daisyUI)

specialized versions of current AppointmentList
    AppointmentList
        - AppointmentList
        - WeeklyAppointments
        - NextAppointment
        - NextAppointments

================================


# Daisy ui is on!

user role => header title and links
    admin -> requests | professionals | customers | 
    professional ->
    customer ->





=========================

how availability updates affect appointments?
    if appointment not in new availability
        force an availability slot for the appointment's time/day?        
            or
        fuck it...we don't care about availability when the appointment exists
        
        
        
        
        we only care about availability when 
            creating offers
            rescheduling appointments??? maybe not...
                rescheduling should be a professional <-> customer agreement
                    all we need to consider is the professional availability regarding the existing appointments (availability status)



appointments
    automatic creation for 4 weeks in the future

    reschedule / remarcar
        patches existing appointment's time/day

        customer
        professional
            can offer all slots from all days except slots where I have appointment

            if slot in customer.availability
                highlight it (as a better suggestion)

    cancel / desmarcar
        marks appointment as deleted

    
    stop treatment
        kills future appointments




AppointmentsHistory
    display all appointments where data < Date.now




==========================================



use netlify lambda function to run updates on auth.users...our service_role can't be exposed
fix channel events reaction in Professional component




```
  createEffect(async () => {
      // DEV
      const res = await fetch("/.netlify/functions/hello");
      const res = await fetch("http://localhost:9999/.netlify/functions/hello-world");

      // PROD
    "https://paulin-contrib--lambent-vacherin-760b11.netlify.app/.netlify/functions/hello-world",

    console.log(userStore.session);

    const res = await fetch("http://localhost:9999/.netlify/functions/delete-customer", {
      method: "POST",
      body: JSON.stringify({ message: "Atlantic", name: "Ruuuui", action: "delete this crap!" }),
    });
    .then(async res => await res.json())
    .catch(console.log);
    const data = await res.json();
    console.log({ res, data });
  });

  createEffect(async () => {
    // DEV
    const res = await fetch("/.netlify/functions/adminList2");
    const res = await fetch("http://localhost:9999/.netlify/functions/chuck-norris");

    // PROD
    const res = await fetch(
      "https://paulin-contrib--lambent-vacherin-760b11.netlify.app/.netlify/functions/chuck-norris"
    );
    const data = await res.json();
    console.log({ data });
  });

  console.log(import.meta.env.VITE_SUPABASE_KEY);

  createEffect(async () => {
    // DEV
    const res = await fetch("/.netlify/functions/adminList2");
    const res = await fetch("http://localhost:9999/.netlify/functions/auth-fetch");

    // PROD
    const res = await fetch(
      "https://paulin-contrib--lambent-vacherin-760b11.netlify.app/.netlify/functions/auth-fetch"
    );
    const data = await res.json();
    console.log({ data });
  });

  createEffect(async () => {
    try {
      const { data, error } = await getSupabaseAdmin().auth.admin.listUsers();
      console.log({ data });
    } catch (err) {
      console.log(err);
    }
  });
```