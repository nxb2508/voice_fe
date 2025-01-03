import { Navigate } from "react-router-dom";
import LayoutDefault from "../components/Layouts/LayoutDefault";
import AudioRecorder from "../components/AudioRecorder";
import VoiceChanger from "../pages/VoiceChanger";
import TextToSpeech from "../pages/TextToSpeech";
import PrivateRoutes from "../components/PrivateRoutes";
import ModelManage from "../pages/UserModelManage";
import CreateModel from "../pages/UserModelManage/CreateModel";
import History from "../pages/History";
import Login from "../pages/Login";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Navigate to="/voice-changer" replace />,
      },
      {
        path: "voice-changer",
        element: <VoiceChanger />,
      },
      {
        path: "text-to-speech",
        element: <TextToSpeech />,
      },
      {
        path: "recorder",
        element: <AudioRecorder />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "manage-model",
            element: <ModelManage />,
          },
          {
            path: "create-model",
            element: <CreateModel />,
          },
          {
            path: "history",
            element: <History />,
          },
        ],
      },
    ],
  },
];
