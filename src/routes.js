import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));

const LDepart = React.lazy(() => import("./views/master/depart/ListDepart"));
const FDepart = React.lazy(() => import("./views/master/depart/FormDepart"));
const LSection = React.lazy(() => import("./views/master/section/ListSection"));
const FSection = React.lazy(() => import("./views/master/section/FormSection"));
const ListUser = React.lazy(() => import("./views/master/user/ListUser"));
const FormUser = React.lazy(() => import("./views/master/user/FormUser"));

const routes = [
  // { path: "/master/user", name: "Master User", element: LUser },
  // { path: "/master/user/:type", name: "Master User", element: FUser },
  // { path: "/master/user/:type/:id", name: "Master User", element: FUser },
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  // Master Depart
  {
    path: "/master/department",
    name: "Master Department",
    element: LDepart,
  },
  {
    path: "/master/department/:type",
    name: "Create Department",
    element: FDepart,
  },
  {
    path: "/master/department/:type/:id",
    name: "Detail Department",
    element: FDepart,
  },
  // Master Section
  { path: "/master/section", name: "Master Section", element: LSection },
  { path: "/master/section/:type", name: "Create Section", element: FSection },
  {
    path: "/master/section/:type/:id",
    name: "Detail Section",
    element: FSection,
  },
  // Master User
  { path: "/master/user", name: "Master User", element: ListUser },
  { path: "/master/user/:type", name: "Create User", element: FormUser },
  { path: "/master/user/:type/:id", name: "Detail User", element: FormUser },
];

export default routes;
