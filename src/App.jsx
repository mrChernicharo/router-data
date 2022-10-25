import { createEffect, ErrorBoundary, onMount } from "solid-js";
import Router from "./router";
import { createQuery, QueryClientProvider, useQueryClient } from "@tanstack/solid-query";
import { queryClient } from "./lib/queryClient";
import { addToast } from "./shared/Toast";
import { translateError } from "./lib/helpers";
import { supabase } from "./lib/supabaseClient";

// import process from "process";
const isDev = () => import.meta.env.MODE === "development";
const envMode = () => import.meta.env.MODE;

function App() {
  return (
    <ErrorBoundary
      fallback={err => {
        console.log(err);
        addToast({ message: translateError(err.message), status: "danger", duration: 3500 });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Router />
        <pre>
          {JSON.stringify(
            {
              isDev: isDev(),
              mode: envMode(),
              dev: import.meta.env.DEV,
              prod: import.meta.env.PROD,
              // env: import.meta.env,
            },
            null,
            1
          )}
        </pre>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
