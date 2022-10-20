/************ DDL *************/

CREATE TYPE AVAILABILITY_STATUS AS ENUM('0', '1');
CREATE TYPE REALTIME_APPOINTMENT_STATUS  AS ENUM('0', '1', '2'); -- canceled | confirmed | completed
CREATE TYPE WEEK_DAY AS ENUM('0', '1', '2', '3', '4', '5', '6');
CREATE TYPE TIME_SLOT AS ENUM('00:00', '00:30',
'01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
'04:00', '04:30', '05:00', '05:30',  '06:00', '06:30',
'07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
'10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
'13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
'16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
'19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
'22:00', '22:30', '23:00', '23:30');

create table staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(60),
  email varchar(100) unique
);

create table professionals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(60),
  email varchar(100) unique
);

create table customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(60),
  email varchar(100) unique
);

create table customer_availability (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL,
  day WEEK_DAY,
  time TIME_SLOT,
  status AVAILABILITY_STATUS,

  constraint fk_availability_customer_id foreign key (customer_id) references customers(id) ON delete cascade
);

create table professional_availability (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id uuid NOT NULL,
  day WEEK_DAY,
  time TIME_SLOT,
  status AVAILABILITY_STATUS,

  constraint fk_availability_professional_id foreign key (professional_id) references professionals(id) ON delete cascade
);

create table appointment_offers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL,
  professional_id uuid NOT NULL,
  customer_availability_slot_id uuid NOT NULL,
  professional_availability_slot_id uuid NOT NULL,
  day WEEK_DAY,
  time TIME_SLOT,

  constraint fk_appointment_offer_professional_id foreign key (professional_id) references professionals(id) ON delete cascade,
  constraint fk_appointment_offer_customer_id foreign key (customer_id) references customers(id) ON delete cascade,
  constraint fk_professional_availability_slot_id foreign key (professional_availability_slot_id) references professional_availability(id) ON delete cascade,
  constraint fk_customer_availability_slot_id foreign key (customer_availability_slot_id) references customer_availability(id) ON delete cascade
);

create table realtime_appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  day WEEK_DAY,
  time TIME_SLOT,
  status REALTIME_APPOINTMENT_STATUS default '1',
  datetime timestamp NOT NULL,

  constraint fk_appointments_customer_id foreign key (customer_id) references customers(id) ON delete cascade,
  constraint fk_appointments_professional_id foreign key (professional_id) references professionals(id) ON delete cascade
);





/* ******* HELPER VIEWS ******* */

---- find unattended customers
create or replace view vw_retrieve_unattended_customers as
select c.* from customers as c
left join appointment_offers as o
on o.customer_id = c.id
left join realtime_appointments as a
on a.customer_id = c.id
where a.day is null and o.day is null;

---- find customers with appointments
create or replace view vw_retrieve_customers_with_appointments as
select c.* from customers as c
left join realtime_appointments as a
on a.customer_id = c.id
where a.day is not null;


---- find customers with offers
create or replace view vw_retrieve_customers_with_offers as
select distinct c.* from customers as c
inner join appointment_offers as o
on o.customer_id = c.id

;

/************ VIEWS ***************/

/* 1 ADMIN PAGE */
create or replace view vw_admin_page as
select 
  (select count(*) from customers) as customers_count,
  (select count(*) from professionals) as professionals_count,
  (select count(*) from staff) as staff_count,
  (select count(*) from customers) + (select count(*) from professionals) as total_users_count,
  count(*) as unattended_count from vw_retrieve_unattended_customers;


/* 2 ADMIN/STAFF PAGE */
create or replace view vw_staff_page as
select s.id as staff_id, s.name as staff_name, s.email as staff_email, p.id as professional_id, p.name as professional_name, p.email as professional_email
from staff as s
full join professionals as p
on s.email = p.email;


/* 3 APPOINTMENT REQUEST */
create or replace view vw_appointment_request_page as
select c.*, u.name as is_unattended, o.name as has_offer, a.name as has_appointment from customers as c
left join vw_retrieve_unattended_customers as u
on c.id = u.id
left join vw_retrieve_customers_with_appointments as a
on c.id = a.id
left join vw_retrieve_customers_with_offers as o
on c.id = o.id;

select * from vw_appointment_request_page;


/* 4 ADMIN/CUSTOMER REQUEST AVAILABILITY */
create or replace view customer_appointment_possibilities as 
  select distinct  c.id as customer_id, ca.day, c.name as customer,  
    pa.time, p.name as professional, p.id as professional_id
  from customer_availability as ca
  right join customers as c
  on c.id = ca.customer_id
  right join professional_availability as pa
  on pa.time = ca.time
  right join professionals as p
  on p.id = pa.professional_id
  where pa.status != '0' and c.name is not null
  order by ca.day, pa.time;


/************ FUNCTIONS ***************/

-- 1. GET APPOINTMENT POSSIBILITIES (IMPERFEITA)
create or replace function get_appointment_possibilities(id uuid) 
returns setof customer_appointment_possibilities as $$
  select * from customer_appointment_possibilities
  where customer_id = id;
$$ language sql;



-- 2. CREATE APPOINTMENT
  create or replace function fn_create_first_appointment 
  (customer_id uuid, professional_id uuid, day WEEK_DAY, hour TIME_SLOT, datetime TIMESTAMP) 
  returns setof realtime_appointments as $$
    begin
      if exists (select * from realtime_appointments as a where a.professional_id = $2 and a.day = $3 and a.time = $4)
      then 
        raise exception sqlstate '90001' using message = concat('appointement exists for professional id ', $2, ' canceling transaction');
      end if;

      delete from appointment_offers as a where a.customer_id = $1;
      delete from appointment_offers as a where a.professional_id = $2 and a.day = $3 and a.time = $4;
      update customer_availability as c set status = '0' where c.customer_id = $1 and c.day = $3 and c.time = $4;
      update professional_availability as p set status = '0' where p.professional_id = $2 and p.day = $3 and p.time = $4;
      
      insert into realtime_appointments (customer_id, professional_id, day, time, datetime) values ($1, $2, $3, $4, $5);

      return query select * from realtime_appointments as a 
      where a.customer_id = $1 and a.professional_id = $2 and a.day = $3 and a.time = $4;
    end;
  $$ language 'plpgsql';



/************ RESETS ***************/

-- select * from pg_catalog.pg_proc where proname = 'fn_create_first_appointment';
-- delete from pg_catalog.pg_proc where proname = 'fn_create_first_appointment';
-- drop view vw_staff_page;
-- drop function get_appointment_possibilities;
-- drop view customer_appointment_possibilities;
-- drop view vw_appointment_request_page;

----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------- DRAFTING AREA --------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------



SELECT * FROM  information_schema.columns WHERE  table_name = 'appointment_offers';
+

SELECT routine_name FROM information_schema.routines WHERE routine_type = 'FUNCTION' AND routine_schema = 'public';

delete FROM information_schema.routines WHERE routine_type = 'FUNCTION' AND routine_schema = 'public' and routine_name = 'fn_create_first_appointment';
