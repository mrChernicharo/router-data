import { createEffect, ErrorBoundary, onMount } from "solid-js";
import Router from "./router";
import { createQuery, QueryClientProvider, useQueryClient } from "@tanstack/solid-query";
import { queryClient } from "./lib/queryClient";
import { addToast } from "./shared/Toast";
import { translateError } from "./lib/translations";
import { supabase } from "./lib/supabaseClient";

function App() {
  return (
    <ErrorBoundary
      fallback={err => {
        console.log(err);
        addToast({ message: translateError(err.message), status: "danger", duration: 10000 });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
