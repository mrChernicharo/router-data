import { createResource } from "solid-js";

import {
  fetchLoginFakeData,
  fetchAdminData,
  fetchAdminRequestsData,
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
  const [adminData] = createResource(fetchAdminData);
  return adminData;
}

function LoginFakeData({ params, location, navigate, data }) {
  const [adminData] = createResource(fetchLoginFakeData);
  return adminData;
}

function AdminRequestsData() {
  const [requestsData, { mutate: mutateRequests, refetch: refetchRequests }] =
    createResource(fetchAdminRequestsData);
  return [requestsData, { mutateRequests, refetchRequests }];
}

function CustomersData({ params, location, navigate, data }) {
  const [customersData] = createResource(fetchCustomersData);
  return customersData;
}

function CustomerData({ params, location, navigate, data }) {
  const [customerData] = createResource(() => fetchCustomerData(params.id));
  return customerData;
}

function ProfessionalsData({ params, location, navigate, data }) {
  const [professionalsData] = createResource(fetchProfessionalsData);
  return professionalsData;
}

function ProfessionalData({ params, location, navigate, data }) {
  const [professionalData] = createResource(() => fetchProfessionalData(params.id));
  return professionalData;
}

function StaffData({ params, location, navigate, data }) {
  const [staffData, { mutate: mutateStaff, refetch: refetchStaff }] = createResource(fetchStaffData);
  console.log(staffData());
  return [staffData, { mutateStaff, refetchStaff }];
}

function AppointmentData({ params, location, navigate, data }) {
  const [appointmentData] = createResource(() => fetchAppointmentData(params.id));
  return appointmentData;
}

export {
  AdminData,
  AdminRequestsData,
  CustomersData,
  ProfessionalsData,
  StaffData,
  CustomerData,
  ProfessionalData,
  AppointmentData,
  LoginFakeData,
};
