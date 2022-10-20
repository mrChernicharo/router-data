import { Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";

import Badge from "../shared/Badge";
import Loading from "../shared/Loading";
import { fetchAdminData } from "../lib/fetchFuncs";
import { FaSolidChevronRight } from "solid-icons/fa";

export default function Admin() {
  const query = createQuery(() => ["admin"], fetchAdminData, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
  });

  const infoCards = data => [
    { title: "Customers", value: data?.customers_count, description: "total customers" },
    { title: "Professionals", value: data?.professionals_count, description: "total professionals" },
    { title: "Staff", value: data?.staff_count, description: "total staff" },
    { title: "Total Users", value: data?.total_users_count, description: "total users" },
    {
      title: "Unattended Customers",
      value: query.data?.unattended_count,
      description: "customers waiting",
    },
  ];

  return (
    <div data-component="Admin">
      <div class="text-secondary">
        <nav class="mb-4 flex gap-1">
          <a class="link" href="/admin/customers">
            Customers
          </a>
          |
          <a class="link" href="/admin/professionals">
            Professionals
          </a>
          |
          <a class="link" href="/admin/staff">
            Staff
          </a>
        </nav>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<Loading />}>
        <div class="flex gap-2 flex-wrap justify-center">
          <For each={infoCards(query.data)}>
            {card => (
              <div class="stats shadow">
                <div class="stat place-items-center bg-white">
                  <div class="stat-title">{card.title}</div>
                  <div class="stat-value">{card.value}</div>
                  <div class="stat-desc">{card.description}</div>
                </div>
              </div>
            )}
          </For>
        </div>

        <h3 class="mt-4">
          <Badge danger={query.data?.unattended_count > 0} />
          <Link class="flex nav-link align-items-center" href="/admin/requests">
            <div>Requests</div>
            <FaSolidChevronRight />
          </Link>
        </h3>
      </Suspense>

      {/* <pre>{JSON.stringify(query, null, 1)}</pre> */}
    </div>
  );
}
