import { Link } from "solid-app-router";

export default function Home() {
  return (
    <div>
      <h1>Hello Laços</h1>
      <Link href="/login">Login</Link>
    </div>
  );
}
