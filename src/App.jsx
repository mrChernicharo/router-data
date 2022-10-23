import { ErrorBoundary } from "solid-js";
import Router from "./router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "./lib/queryClient";
import { addToast } from "./shared/ToastContainer";
import { translateError } from "./lib/helpers";

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
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
