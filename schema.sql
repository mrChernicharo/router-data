/************** ALTERS ***************/
DROP POLICY "Enable read access for all users or to felipe" on auth.users;

CREATE POLICY "Enable read access for all users or to felipe" ON "auth"."users"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.email() = 'felipe.chernicharo@gmail.com');



alter table professionals add column auth_id uuid;
alter table professionals add constraint fk_professional_auth_id foreign key (auth_id) references auth.users(id) on delete cascade;
select * from professionals;
select * from auth.users where id = 'f57577ec-1a72-4796-a48f-659cba57d9e2';


alter table customers add column auth_id uuid;
alter table customers modify column auth_id uuid to auth_id uuid not null;
alter table customers add constraint fk_customer_auth_id foreign key (auth_id) references auth.users(id) on delete cascade;


alter table customers add column first_name varchar, add column last_name varchar, add column phone varchar(16), add column date_of_birth date;
update customers set name = null where true;
alter table customers drop column name;
select * from customers;

/************ DDL *************/

CREATE TYPE AVAILABILITY_STATUS AS ENUM('0', '1');
CREATE TYPE REALTIME_APPOINTMENT_STATUS  AS ENUM('0', '1', '2'); -- canceled | confirmed | completed
CREATE TYPE WEEK_DAY AS ENUM('0', '1', '2', '3', '4', '5', '6');
CREATE TYPE USER_CATEGORY AS ENUM('customer', 'professional', 'manager', 'admin');
CREATE TYPE TIME_SLOT AS ENUM('00:00', '00:30',
'01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
'04:00', '04:30', '05:00', '05:30',  '06:00', '06:30',
'07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
'10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
'13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
'16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
'19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
'22:00', '22:30', '23:00', '23:30');

select * from auth.users;

create table staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category USER_CATEGORY default 'professional',
  email varchar(100) unique
);


create table professionals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar(100) unique,
  auth_id uuid not null,
  first_name varchar, 
  last_name varchar, 
  date_of_birth date,
  phone varchar(16), 

  constraint fk_professional_auth_id foreign key (auth_id) references auth.users(id) --ON delete cascade,
);


create table customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar(100) unique,
  auth_id uuid not null,
  first_name varchar, 
  last_name varchar, 
  date_of_birth date,
  phone varchar(16), 

  constraint fk_customer_auth_id foreign key (auth_id) references auth.users(id)
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
on o.customer_id = c.id;

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
select s.id as staff_id, s.category, s.email as staff_email, p.id as professional_id, p.first_name as professional_name, p.email as professional_email
from staff as s
full join professionals as p
on s.email = p.email;


/* 3 APPOINTMENT REQUEST */
create or replace view vw_appointment_request_page as
select distinct c.*, u.first_name as is_unattended, o.first_name as has_offer, a.first_name as has_appointment from customers as c
left join vw_retrieve_unattended_customers as u
on c.id = u.id
left join vw_retrieve_customers_with_appointments as a
on c.id = a.id
left join vw_retrieve_customers_with_offers as o
on c.id = o.id;

select * from vw_appointment_request_page;


/* 4 ADMIN/CUSTOMER REQUEST AVAILABILITY */
create or replace view vw_customer_appointment_possibilities as 
  select distinct  c.id as customer_id, ca.day, c.first_name as customer,  
    pa.time, p.first_name as professional, p.id as professional_id
  from customer_availability as ca
  right join customers as c
  on c.id = ca.customer_id
  right join professional_availability as pa
  on pa.time = ca.time
  right join professionals as p
  on p.id = pa.professional_id
  where pa.status != '0' and c.first_name is not null
  order by ca.day, pa.time;




/* 5. */


-- select * from professionals where id = '49ae2ea8-e40b-4538-8739-c098d592803e';
select * from customers;

/************ FUNCTIONS ***************/

-- 1. GET APPOINTMENT POSSIBILITIES (IMPERFEITA)
create or replace function fn_get_appointment_possibilities(id uuid) 
returns setof vw_customer_appointment_possibilities as $$
  select * from vw_customer_appointment_possibilities
  where customer_id = id;
$$ language sql;

select now() + '1 day'::INTERVAL;
SELECT CURRENT_DATE + '7 day'::INTERVAL;

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
    
    insert into realtime_appointments (customer_id, professional_id, day, time, datetime) 
      values ($1, $2, $3, $4, $5), ($1, $2, $3, $4, $5 + '7 day'::INTERVAL), ($1, $2, $3, $4, $5 + '14 day'::INTERVAL), ($1, $2, $3, $4, $5 + '21 day'::INTERVAL);

    return query select * from realtime_appointments as a 
    where a.customer_id = $1 and a.professional_id = $2 and a.day = $3 and a.time = $4;
  end;
$$ language 'plpgsql';


-- 3. DELETE CUSTOMER/AUTH_USER

-- create or replace function fn_remove_customer
-- (customer_id uuid, email varchar)
-- returns void as $$
--   begin
--     delete from customers as c where c.id = $1;
--     -- delete from auth.users as a where a.email = $2;
--   end;
-- $$ language 'plpgsql';
delete from customers;
insert into staff (email, category) values ('felipe.chernicharo@gmail.com', 'admin');
/***********************************/
/************ RESETS ***************/
/***********************************/

alter table professionals drop constraint fk_professional_auth_id;
alter table customers drop constraint fk_customer_auth_id;
alter table customer_availability drop constraint fk_availability_customer_id;
alter table professional_availability drop constraint fk_availability_professional_id;
alter table appointment_offers drop constraint fk_appointment_offer_professional_id;
alter table appointment_offers drop constraint fk_appointment_offer_customer_id;
alter table appointment_offers drop constraint fk_professional_availability_slot_id;
alter table appointment_offers drop constraint fk_customer_availability_slot_id;
alter table realtime_appointments drop constraint fk_appointments_customer_id;
alter table realtime_appointments drop constraint fk_appointments_professional_id;
alter table realtime_appointments drop constraint realtime_appointments_pkey;
-- alter table realtime_appointments drop constraint fk_appointments_professional_id;

drop function fn_get_appointment_possibilities;
drop function fn_remove_customer;
drop function fn_create_first_appointment;

drop view vw_retrieve_unattended_customers;
drop view vw_retrieve_customers_with_appointments;
drop view vw_retrieve_customers_with_offers;
drop view vw_admin_page;
drop view vw_staff_page;
drop view vw_appointment_request_page;
drop view vw_customer_appointment_possibilities;

delete from staff;
delete from customers;
delete from professionals;
delete from customer_availability;
delete from professional_availability;
delete from realtime_appointments;
delete from appointment_offers;


drop table staff;
drop table appointment_offers;
drop table customers;
drop table professionals;
drop table customer_availability;
drop table professional_availability;
drop table realtime_appointments;

SELECT *
  FROM pg_locks l
  JOIN pg_class t ON l.relation = t.oid AND t.relkind = 'r';
 WHERE t.relname = 'Bill';


--  ****** ---
-- OUR LITTLE CHALLENGE OF DELETING AUTH.USERS
create trigger tr_remove_auth_user
after delete on customers
for each row
execute function fn_remove_auth_user();

create or replace function fn_remove_auth_user() returns trigger as $$
  begin

    delete from auth.users where id = old.auth_id;

    return old;

  end;
$$ language plpgsql;


-- DELETING FROM CUSTOMERS SUCCESSFULLY CALLS THE TRIGGER THAT DELETES FROM AUTH.USERS
-- the problem is to be able to call this from the client...it says permission denied for table users
delete from customers where id = 'f3bef4a0-df34-4836-b812-e8e4ee794029';
select * from customers; 
select count(*) from customers
union
select count (*) from auth.users;

drop trigger tr_remove_auth_user on customers;
drop function fn_remove_auth_user;



----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------- DRAFTING AREA --------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------




select * from auth.users;
select * from staff;
select * from customers;
select * from professionals;
select * from customer_availability;
select * from professional_availability;
select * from realtime_appointments;
select * from appointment_offers;

