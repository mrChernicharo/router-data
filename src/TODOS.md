APPOINTMENTS RULES
FUTURE APPOINTMENTS
automatic creation for 4 weeks in the future ? ... NOPE!
we can show appointments in advance at the calendar and that should be all

SO WHEN TO CREATE NEXT WEEK'S APPOINTMENT?
 as soon as current appointment has passed

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
    - ProfessionalPage OK ✅ 
    - Requests Badge (Nav) pending 
    - Requests Page > Unattended Customer > Availability Matches Partially OK gotta update UI (remove customer) once appointment is created

NEXT UP

CUSTOMER REGISTER TODOs
    * refetch after form submit

signup - customer created (how are we handling default availability?)
start it blank if real customer X default filled if admin
    * edge case: user took too long to click the link...what should we do?
