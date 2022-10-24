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







