import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));

/* 
  MODULE ADMINSTRATOR
  -MASTER
  -SETTING
*/
// MASTER
const LDepart = React.lazy(() => import("./views/master/depart/ListDepart"));
const FDepart = React.lazy(() => import("./views/master/depart/FormDepart"));
const LSection = React.lazy(() => import("./views/master/section/ListSection"));
const FSection = React.lazy(() => import("./views/master/section/FormSection"));
const FRole = React.lazy(() => import("./views/master/role/FormRole"));
const LRole = React.lazy(() => import("./views/master/role/ListRole"));
const ListUser = React.lazy(() => import("./views/master/user/ListUser"));
const FormUser = React.lazy(() => import("./views/master/user/FormUser"));
// SETTING
const LAppr = React.lazy(() => import("./views/setting/approval/ListApproval"));
const FAppr = React.lazy(() => import("./views/setting/approval/FormApproval"));
/*
MODULE ADMINISTRATOR 
*/
const routes = [
  // { path: "/master/user", name: "Master User", element: LUser },
  // { path: "/master/user/:type", name: "Master User", element: FUser },
  // { path: "/master/user/:type/:id", name: "Master User", element: FUser },
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },

  /* 
  MODULE ADMINSTRATOR
  -MASTER
  -SETTING
  */
  //  MASTER
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
  // Master Role
  { path: "/master/role", name: "Master Role", element: LRole },
  { path: "/master/role/:type", name: "Create Role", element: FRole },
  { path: "/master/role/:type/:id", name: "Detail Role", element: FRole },
  // Master User
  { path: "/master/user", name: "Master User", element: ListUser },
  { path: "/master/user/:type", name: "Create User", element: FormUser },
  { path: "/master/user/:type/:id", name: "Detail User", element: FormUser },
  // SETTING
  { path: "/setting/approval", name: "Master Approval", element: LAppr },
  { path: "/setting/approval/:type", name: "Create Approval", element: FAppr },
  {
    path: "/setting/approvalr/:type/:id",
    name: "Detail Approval",
    element: FAppr,
  },
];

export default routes;
