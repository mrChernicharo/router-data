import { Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";

import Button from "../shared/Button";
import Badge from "../shared/Badge";
import Icon from "../shared/Icon";
import Loading from "../shared/Loading";
import { fetchAdminData } from "../lib/fetchFuncs";

export default function Admin() {
  const query = createQuery(() => ["admin"], fetchAdminData, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
  });

  return (
    <div data-component="Admin">
      <Link href="/login">
        <Button kind="light" text="👈🏽" type="button" />
      </Link>

      <div>
        <h1 class="text-3xl font-bold underline">Admin</h1>

        <nav class="mb-4">
          <a href="/admin/customers">Customers</a> | <a href="/admin/professionals">Professionals</a> |{" "}
          <a href="/admin/staff">Staff</a>
        </nav>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<Loading />}>
        <div class="flex gap-2" style={{ "flex-wrap": "wrap" }}>
          <div
            class="card flex gap-2 p-2 justify-content-center align-items-center"
            style={{ "min-width": "100px" }}
          >
            <div class="card-title fw-bold">Customers</div>
            <div class="card-body">{query.data?.customers_count}</div>
          </div>
          <div
            class="card flex gap-2 p-2 justify-content-center align-items-center"
            style={{ "min-width": "100px" }}
          >
            <div class="card-title fw-bold">Professionals</div>
            <div class="card-body">{query.data?.professionals_count}</div>
          </div>
          <div
            class="card flex gap-2 p-2 justify-content-center align-items-center"
            style={{ "min-width": "100px" }}
          >
            <div class="card-title fw-bold">Staff</div>
            <div class="card-body">{query.data?.staff_count}</div>
          </div>
          <div
            class="card flex gap-2 p-2 justify-content-center align-items-center"
            style={{ "min-width": "100px" }}
          >
            <div class="card-title fw-bold">Total Users</div>
            <div class="card-body">{query.data?.total_users_count}</div>
          </div>
          <div
            class="card flex gap-2 p-2 justify-content-center align-items-center"
            style={{ "min-width": "100px" }}
          >
            <div class="card-title fw-bold">Unattended Customers</div>
            <div class="card-body">{query.data?.unattended_count}</div>
          </div>
        </div>

        <h3 class="mt-4">
          <Badge danger={query.data?.unattended_count > 0} />
          <Link class="flex nav-link align-items-center" href="/admin/requests">
            <div>Requests</div>
            <Icon chevronRight />
          </Link>
        </h3>
      </Suspense>

      {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
    </div>
  );
}
