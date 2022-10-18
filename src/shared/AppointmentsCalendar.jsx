import Button from "./Button";
import CollapseBox from "./CollapseBox";

export default function AppointmentsCalendar(props) {
  return (
    <div data-component="AppointmentsCalendar">
      <h4>Appointments Calendar</h4>
      <CollapseBox>
        <Button kind="light" text="day" />
        <Button kind="light" text="week" />
        <Button kind="light" text="month" />

        {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
      </CollapseBox>
    </div>
  );
}
