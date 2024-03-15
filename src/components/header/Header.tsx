import "./Header.css";

const Header = (props: { streak: number }) => {
  return (
    <header>
      <h1 className="logo">Fitpath</h1>
      <span id="streak">{props.streak} Day Streak 🔥</span>
    </header>
  );
};

export default Header;
