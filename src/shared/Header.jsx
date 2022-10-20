import Button from "../shared/Button";
import { s } from "../lib/styles";
import { useLocation } from "solid-app-router";

export default function Header(props) {
  const location = useLocation();
  return (
    <header class="bg-white">
      <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">
          {location.pathname.split("/")[2] ?? location.pathname.split("/")[1]}
        </h1>
      </div>
    </header>
  );
}
