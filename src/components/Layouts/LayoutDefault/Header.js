import { Link, NavLink } from "react-router-dom";

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
        <NavLink className="nav-header" to="/voice-changer">{"Voice Changer"}</NavLink>
        <NavLink className="nav-header" to="/text-to-speech">{"Text To Speech"}</NavLink>
      </div>
    </header>
  );
}

export default Header;
