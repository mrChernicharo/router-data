import { Link } from "solid-app-router";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Link href="/admin">admin</Link> | <Link href="/professional">professional</Link> |{" "}
      <Link href="/customer">customer</Link>
    </div>
  );
}
