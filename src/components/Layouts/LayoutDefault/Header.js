import { Link, NavLink } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { deleteAllCookies, getCookie, setCookie } from "../../../helper/cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, message, Modal, Dropdown, Avatar } from "antd";
import { LogoutOutlined, LoginOutlined, GoogleOutlined } from "@ant-design/icons";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function Header() {
  const [token, setToken] = useState(getCookie("token"));
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      const idToken = await user.getIdToken();

      const response = await fetch(
        "https://voice-be-amber.vercel.app/api/auth/verify-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();

      if (data) {
        setCookie("token", data.token, 1);
        setToken(data.token);
        message.success("Sign in successfully");
        setIsModalVisible(false);
      }
    } catch (error) {
      alert("Failed to sign in with Google");
    }
  };
  const handleLogout = async () => {
    deleteAllCookies();
    setToken(undefined);
    signOut(auth)
      .then(() => {
        message.success("Sign out successfully");
      })
      .catch((error) => {
        message.error("Failed to sign out");
      });
    navigate("/");
  };

  const profileItems = [
    {
      key: "name",
      label: (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          Hi, {user ? user.displayName : ""}
        </div>
      ),
    },
    {
      key: "logout",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          <LogoutOutlined />
          <span
            style={{
              marginLeft: "10px",
            }}
          >
            {"Logout"}
          </span>
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  const showLoginModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
        console.log(user.photoURL);
      } else {
        setUser(null);
        deleteAllCookies();
        setToken(undefined);
      }
    });
  }, []);

  return (
    <>
      <Modal
        title="Login"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "20px",
        }}
        centered={true}
      >
        <Button onClick={handleGoogleSignIn} icon={<GoogleOutlined />}>
          {"Continue in with Google"}
        </Button>
      </Modal>
      <header className="layout__header">
        <div className={"layout__logo "}>
          <Link to="/voice-changer">{"Voice Tools"}</Link>
        </div>
        <div className="layout__nav">
          <NavLink className="nav-header" to="/voice-changer">
            {"Voice Changer"}
          </NavLink>
          <NavLink className="nav-header" to="/text-to-speech">
            {"Text To Speech"}
          </NavLink>
          {token ? (
            <>
              <NavLink className="nav-header" to="/manage-model">
                {"Manage Model"}
              </NavLink>
              <Dropdown
                menu={{
                  items: profileItems,
                }}
                placement="bottomRight"
                arrow
              >
                <Avatar
                  src={user && user.photoURL ? user.photoURL : null}
                  size={60}
                />
              </Dropdown>
            </>
          ) : (
            <Link className="nav-header" onClick={showLoginModal}>
              <LoginOutlined />
              <span
                style={{
                  marginLeft: "5px",
                }}
              >
                {"Login"}
              </span>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
