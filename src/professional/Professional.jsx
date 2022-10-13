import { useRouteData, Link } from "solid-app-router";
import ProfessionalAppointments from "../admin/ProfessionalAppointments";
import ProfessionalAvailability from "../admin/ProfessionalAvailability";
import Button from "../shared/Button";
export default function Professional() {
  const data = useRouteData();

  return (
    <div>
      <Link href="/login">
        <Button kind="light" type="button" text="👈🏽" />
      </Link>
      <div> Professional</div>
      <Suspense fallback={<>Loading...</>}>
        <h1>{data()?.professional.name}</h1>
        <div>{data()?.professional.email}</div>

        <ProfessionalAppointments appointments={data()?.professional.appointments} />

        <ProfessionalAvailability availability={data()?.professional.availability} />
        {/* <pre>{JSON.stringify(data(), null, 1)}</pre> */}
      </Suspense>
    </div>
  );
}
