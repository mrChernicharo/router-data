import Button from "../shared/Button";
import { s } from "../lib/styles";

export default function Header(props) {
  return (
    <header style={s.header}>
      <div>🌺</div>
      <a href="/login">
        <Button kind="logout" />
      </a>
    </header>
  );
}
