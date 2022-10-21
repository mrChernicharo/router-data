import Router from "./router";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "./lib/queryClient";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";

function App() {
  const res = resolveConfig(tailwindConfig);

  console.log({ res });
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
