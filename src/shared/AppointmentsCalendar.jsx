import CollapseBox from "./CollapseBox";
import ListItem from "./ListItem";

export default function AppointmentsCalendar(props) {
  return (
    <div data-component="AppointmentsCalendar">
      <ListItem classes="p-4">
        <h4 class="font-bold text-xl">Appointments Calendar</h4>
        <CollapseBox>
          <button class="btn btn-ghost">day</button>
          <button class="btn btn-ghost">week</button>
          <button class="btn btn-ghost">month</button>

          <div>{props.person.id}</div>
          <div>{props.person.name}</div>
          <div>{props.person.email}</div>
          <pre>{JSON.stringify(props.appointments, null, 2)}</pre>
        </CollapseBox>
      </ListItem>
    </div>
  );
}
