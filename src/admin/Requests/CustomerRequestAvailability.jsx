import { createQuery } from "@tanstack/solid-query";
import { fetchCustomerRequestAvailability } from "../../lib/fetchFuncs";

export default function CustomerRequestAvailability(props) {
  const query = createQuery(
    () => ["request", props.customerId],
    () => fetchCustomerRequestAvailability(props.customerId)
  );

  return (
    <div>
      <div>{props.customerId}</div>

      <pre>{JSON.stringify(query, null, 1)}</pre>
    </div>
  );
}
