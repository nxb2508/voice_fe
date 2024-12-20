import { Navigate } from "react-router-dom";
import LayoutDefault from "../components/Layouts/LayoutDefault";
import AudioRecorder from "../components/AudioRecorder";
import VoiceChanger from "../pages/VoiceChanger";
import TextToSpeech from "../pages/TextToSpeech";
import VoiceType from "../pages/VoiceType";
import TrainModel from "../pages/TrainModel";
import PrivateRoutes from "../components/PrivateRoutes";
export const routes = [
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
        path: "recorder",
        element: <AudioRecorder />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "train-model",
            element: <TrainModel />,
          },
        ]
      }
    ],
  },
];
