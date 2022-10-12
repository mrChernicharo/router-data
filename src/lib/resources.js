import { createResource } from "solid-js";

import {
  fetchAdminCountsData,
  fetchAdminData,
  fetchAppointmentData,
  fetchAppointmentOffers,
  fetchAppointmentsData,
  fetchCustomerAvailability,
  fetchCustomerData,
  fetchCustomersData,
  fetchProfessionalAvailability,
  fetchProfessionalData,
  fetchProfessionalsData,
  fetchRealtimeAppointments,
  fetchStaffData,
} from "./fetchFuncs";

function AdminData({ params, location, navigate, data }) {
  const [adminData] = createResource(fetchAdminCountsData);
  return adminData;
}

function CustomersData({ params, location, navigate, data }) {
  const [customersData] = createResource(fetchCustomersData);
  return customersData;
}

function ProfessionalsData({ params, location, navigate, data }) {
  const [professionalsData] = createResource(fetchProfessionalsData);
  return professionalsData;
}

function StaffData({ params, location, navigate, data }) {
  const [staffData, { mutate: mutateStaff, refetch: refetchStaff }] = createResource(fetchStaffData);
  console.log(staffData());
  return [staffData, { mutateStaff, refetchStaff }];
}

function CustomerData({ params, location, navigate, data }) {
  const [customerData] = createResource(() => fetchCustomerData(params.id));
  return customerData;
}

function ProfessionalData({ params, location, navigate, data }) {
  const [professionalData] = createResource(() => fetchProfessionalData(params.id));
  return professionalData;
}

function AppointmentData({ params, location, navigate, data }) {
  const [appointmentData] = createResource(() => fetchAppointmentData(params.id));
  return appointmentData;
}

export {
  AdminData,
  CustomersData,
  ProfessionalsData,
  StaffData,
  CustomerData,
  ProfessionalData,
  AppointmentData,
};
