import { Link, NavLink } from "react-router-dom";
import ApiDomainSetter from "../../ApiDomainSetter";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { deleteAllCookies, getCookie, setCookie } from "../../../helper/cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function Header() {
  const [token, setToken] = useState(getCookie("token"));
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await fetch('http://localhost:4000/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      
      if(data) {
        setCookie("token", data.token, 1)
        setToken(data.token)
        alert(`Welcome, ${user.displayName}!`);
      }
    } catch (error) {
      alert('Failed to sign in with Google');
    }
  };
  const handleLogout = () => {
    deleteAllCookies()
    setToken(undefined)
    navigate("/")
  }
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
        {token ? <><NavLink className="nav-header" to="/train-model">
          {"Create Model"}
        </NavLink>
        <Button className="nav-header" onClick={handleLogout}>
          {"Logout"}
        </Button></> : <Link className="nav-header" onClick={handleGoogleSignIn}>
          {"Login"}
        </Link>}
      </div>
    </header>
  );
}

export default Header;
