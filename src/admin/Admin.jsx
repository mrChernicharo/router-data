import { useNavigate, useRouteData, Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "../lib/userStore";

import CollapseBox from "../shared/CollapseBox";
import AppointmentRequests from "./Requests";
import AppointmentPossibilities from "./AppointmentPossibilities";
import Button from "../shared/Button";
import Badge from "../shared/Badge";
import Icon from "../shared/Icon";
import Loading from "../shared/Loading";
import { fetchAdminData } from "../lib/fetchFuncs";

export default function Admin() {
  const query = createQuery(() => ["admin"], fetchAdminData);

  return (
    <div>
      <Link href="/login">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      <div>
        <h1>Admin</h1>

        <nav>
          <a href="/admin/customers">Customers</a> | <a href="/admin/professionals">Professionals</a> |{" "}
          <a href="/admin/staff">Staff</a>
        </nav>
      </div>

      <Suspense fallback={<Loading />}>
        <h3 class="mt-4">
          <Badge danger={query.data?.unattended_count > 0} />
          <Link class="d-flex nav-link align-items-center" href="/admin/requests">
            <div>Appointment Requests</div>
            <Icon chevronRight />
          </Link>
        </h3>
      </Suspense>

      {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
    </div>
  );
}
