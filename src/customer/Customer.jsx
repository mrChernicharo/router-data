import { useRouteData, Link } from "solid-app-router";
import CustomerAppointments from "../admin/Customers/CustomerAppointments";
import CustomerAvailability from "../admin/CustomerAvailability";
import Button from "../shared/Button";

export default function Customers() {
  const data = useRouteData();

  return (
    <div>
      <Link href="/login">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div>Customer</div>

      <Suspense fallback={<>Loading...</>}>
        <h1>{data()?.customer.name}</h1>
        <div>{data()?.customer.email}</div>

        <CustomerAppointments appointments={data()?.customer.appointments} />

        <CustomerAvailability availability={data()?.customer.availability} />
        {/* <pre>{JSON.stringify(data(), null, 1)}</pre> */}
      </Suspense>
    </div>
  );
}
