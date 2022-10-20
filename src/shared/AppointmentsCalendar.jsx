import Button from "./Button";
import CollapseBox from "./CollapseBox";
import ListItem from "./ListItem";

export default function AppointmentsCalendar(props) {
  return (
    <div data-component="AppointmentsCalendar">
      <ListItem classes="p-4">
        <h4 class="font-bold text-xl">Appointments Calendar</h4>
        <CollapseBox>
          <Button kind="light" text="day" />
          <Button kind="light" text="week" />
          <Button kind="light" text="month" />

          <div>{props.person.id}</div>
          <div>{props.person.name}</div>
          <div>{props.person.email}</div>
          <pre>{JSON.stringify(props.appointments, null, 2)}</pre>
        </CollapseBox>
      </ListItem>
    </div>
  );
}
