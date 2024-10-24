import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="layout__header">
      <div
        className={
          "layout__logo "
        }
      >
        <Link to="/voice-changer">{"Voice Tools"}</Link>
      </div>
      <div className="layout__nav">
      </div>
    </header>
  );
}

export default Header;
