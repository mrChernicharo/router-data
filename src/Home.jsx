import { Link } from "solid-app-router";
import Hero from "./shared/Hero";
import Header from "./shared/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <div class="mt-8 flex justify-center w-[100%]">
        <Link href="/login">
          <button class="btn btn-lg btn-accent" style={{ width: `min(calc(100vw - 2rem), 800px)` }}>
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
