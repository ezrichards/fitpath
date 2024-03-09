import "./Header.css";

export default function Header() {
  return (
    <header>
      <h1 className="logo">Fitpath</h1>
      <span id="streak">0🔥</span>
      <span id="pathName">No Path</span>
    </header>
  );
}
