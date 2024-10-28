import { Navigate } from "react-router-dom";
import LayoutDefault from "../components/Layouts/LayoutDefault";
import VoiceChanger from "../pages/VoiceChanger";
import TextToSpeech from "../pages/TextToSpeech";
export const routes = [
  // Public
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <VoiceChanger />,
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
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
  // End Public
];
