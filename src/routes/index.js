import { Navigate } from "react-router-dom";
import LayoutDefault from "../components/Layouts/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecordMode from "../pages/RecordMode";

export const routes = [
  // Public
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "record-mode",
        element: <RecordMode />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
  // End Public

  // Private
  // {
  //   element: <PrivateRoutes />,
  //   children: [
  //     {
  //       element: <LayoutAdmin />,
  //       children: [
  //         {
  //           path: "admin",
  //           element: <Dashboard />,
  //         }
  //       ],
  //     },
  //   ],
  // },
  // End Private
];
