
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



APPOINTMENTS RULES
    FUTURE APPOINTMENTS
        automatic creation for 4 weeks in the future ? ... NOPE!
        we can show appointments in advance at the calendar and that should be all

    RESCHEDULING
        reschedules should only be allowed if (appointment datetime  - now) > 48
        
        rescheduled appointment should be labeled as postponed

        we gotta patch existing appointment's time/day for professional & customer

        CUSTOMER ASKED RESCHEDULE
        
        PROFESSIONAL ASKED RESCHEDULE
            can offer all slots from all days except slots where prof has appointment

            if slot in customer.availability
                highlight it only (as a better suggestion)

    cancel / desmarcar
        marks appointment as deleted

    
    stop treatment
        kills future appointments




=====================

FIXES UP NEXT
    Check updates and reactivity in 
        - ProfessionalPage
        - Requests Badge (Nav)
        - Requests Badges