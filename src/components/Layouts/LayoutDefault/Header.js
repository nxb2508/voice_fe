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
import {
  Button,
  message,
  Modal,
  Dropdown,
  Avatar,
  Drawer,
  Collapse,
} from "antd";
import {
  LogoutOutlined,
  LoginOutlined,
  GoogleOutlined,
  SettingOutlined,
  HistoryOutlined,
  MenuOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";
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
  const [isMobileShow, setIsMobileShow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleCloseDrawer = () => {
    setIsMobileShow(false);
  };

  const handleOpenDrawer = () => {
    setIsMobileShow(true);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log(user);
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
      key: "manage-model",
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
          <SettingOutlined />
          <span
            style={{
              marginLeft: "10px",
            }}
          >
            {"Mange Model"}
          </span>
        </div>
      ),
      onClick: () => navigate("/manage-model"),
    },
    {
      key: "history",
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
          <HistoryOutlined />
          <span
            style={{
              marginLeft: "10px",
            }}
          >
            {"History of changes"}
          </span>
        </div>
      ),
      onClick: () => navigate("/history"),
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

  const accordionItems = [
    {
      key: "1",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            justifyContent: "center",
            fontSize: "18px",
            color: "#fff",
          }}
        >
          <Avatar
            src={user && user.photoURL ? user.photoURL : null}
            size={48}
          />
          <div
            style={{
              fontSize: "16px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            {user ? user.displayName : ""}
          </div>
          {!isExpanded ? <DownOutlined /> : <RightOutlined />}
        </div>
      ),
      children: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <NavLink to="/manage-model">
            <SettingOutlined />
            <span
              style={{
                marginLeft: "10px",
              }}
            >
              {"Mange Model"}
            </span>
          </NavLink>
          <NavLink to="/history">
            <HistoryOutlined />
            <span
              style={{
                marginLeft: "10px",
              }}
            >
              {"History of changes"}
            </span>
          </NavLink>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              justifyContent: "center",
              fontSize: "18px",
              color: "#fff",
            }}
            onClick={handleLogout}
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
        </div>
      ),
      showArrow: false,
    },
  ];

  const showLoginModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        deleteAllCookies();
        setCookie("token", user.accessToken, 1);
        setToken(user.accessToken);
        // console.log(user);
        // console.log(user.photoURL);
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
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   fontSize: "20px",
        // }}
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
              <NavLink className="nav-header" to="/create-model">
                {"Create Model"}
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
                  size={48}
                  style={{
                    cursor: "pointer",
                    marginRight: "30px",
                  }}
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
        <div className="layout__nav-mobile">
          <div className="layout__nav-mobile__menu">
            <MenuOutlined onClick={handleOpenDrawer} />
          </div>
          <Drawer
            onClose={handleCloseDrawer}
            open={isMobileShow}
            className="layout__nav-mobile__drawer"
            style={{
              backgroundColor: "#26252e",
            }}
          >
            <div className="layout__nav-mobile__content">
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
                  <Collapse
                    items={accordionItems}
                    bordered={false}
                    onChange={handleToggleExpand}
                    style={{
                      padding: "0",
                    }}
                  />
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
          </Drawer>
        </div>
      </header>
    </>
  );
}

export default Header;
