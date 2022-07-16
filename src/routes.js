import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));

const routes = [
  // { path: "/master/user", name: "Master User", element: LUser },
  // { path: "/master/user/:type", name: "Master User", element: FUser },
  // { path: "/master/user/:type/:id", name: "Master User", element: FUser },
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
];

export default routes;
