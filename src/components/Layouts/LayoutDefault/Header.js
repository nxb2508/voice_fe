import { Link, NavLink } from "react-router-dom";
import ApiDomainSetter from "../../ApiDomainSetter";
function Header() {
  return (
    <header className="layout__header">
      <div className={"layout__logo "}>
        <Link to="/voice-changer">{"Voice Tools"}</Link>
      </div>
      <div className="layout__api-setter">
        <ApiDomainSetter />
      </div>
      <div className="layout__nav">
        <NavLink className="nav-header" to="/voice-changer">
          {"Voice Changer"}
        </NavLink>
        <NavLink className="nav-header" to="/text-to-speech">
          {"Text To Speech"}
        </NavLink>
        <NavLink className="nav-header" to="/voice-type">
          {"Voice Type"}
        </NavLink>
        <NavLink className="nav-header" to="/train-model">
          {"Create Model"}
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
