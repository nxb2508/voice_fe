import { Navigate } from "react-router-dom";
import LayoutDefault from "../components/Layouts/LayoutDefault";
import VoiceChanger from "../pages/VoiceChanger";
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
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
  // End Public
];
