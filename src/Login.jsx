import { Link } from "solid-app-router";

import Button from "./shared/Button";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <div>
        <Link href="/">
          <Button kind="light" type="button" text="👈🏽" />
        </Link>
      </div>
      <Link href="/admin">admin</Link> | <Link href="/professional">professional</Link> |{" "}
      <Link href="/customer">customer</Link>
    </div>
  );
}
