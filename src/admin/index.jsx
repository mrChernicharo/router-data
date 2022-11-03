import { Link } from "solid-app-router";
import { createQuery } from "@tanstack/solid-query";

import Badge from "../shared/Badge";
import Loading from "../shared/Loading";
import Calendar from "../shared/Calendar";
import { fetchAdminData, fetchAdminRequestsData } from "../lib/fetchFuncs";
import { FaSolidChevronRight } from "solid-icons/fa";
import { createEffect, onMount } from "solid-js";
import { setUserStore, userStore } from "../lib/userStore";
import { supabase, getSupabaseAdmin } from "../lib/supabaseClient";
import { LAMBDA_URL } from "../lib/constants";

export default function Admin() {
  const adminQuery = createQuery(() => ["admin"], fetchAdminData, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    cacheTime: 20_000,
    staleTime: 10_000,
  });

  const infoCards = data => [
    { title: "Clientes", value: data?.customers_count, description: "clientes ativos" },
    { title: "Profissionais", value: data?.professionals_count, description: "profissionais ativos" },
    { title: "Membros", value: data?.staff_count, description: "total de membros" },
    { title: "Usuários", value: data?.total_users_count, description: "total de usuários" },
    {
      title: "Novos Clientes",
      value: data?.unattended_count,
      description: "total de novos clientes",
    },
  ];

  return (
    <div data-component="Admin">
      {/* Stats Cards */}
      <Suspense fallback={<Loading />}>
        <div class="flex gap-2 flex-wrap justify-center">
          <For each={infoCards(adminQuery.data)}>
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
      </Suspense>

      {/* <div class="h-[20vh] flex justify-center items-center"></div> */}
      <div class="flex justify-center items-center">
        <div class="my-12 w-full h-[500px]">
          <Calendar onDateSelected={date => {}} />
        </div>
      </div>

      {/* <pre>{JSON.stringify(userStore, null, 1)}</pre> */}
    </div>
  );
}
