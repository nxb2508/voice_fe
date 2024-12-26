import { Link, NavLink } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { deleteAllCookies, getCookie, setCookie } from "../../helper/cookie";
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
function Login() {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigate = useNavigate();
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
        message.success("Sign in successfully");
        setIsModalVisible(false);
        navigate("/");
      }
    } catch (error) {
      alert("Failed to sign in with Google");
    }
  };

  return (
    <>
      <Modal
        title="Login"
        open={isModalVisible}
        onCancel={() => navigate("/")}
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
    </>
  );
}

export default Login;
