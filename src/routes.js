import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const Profile = React.lazy(() => import("./views/Profile"));
const Configuration = React.lazy(() => import("./views/Configuration"));

/* 
  MODULE ADMINSTRATOR
  -MASTER
  -SYSTEM
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
// MASTER Data
const LCust = React.lazy(() => import("./views/masterData/customer/ListCust"));
const FCust = React.lazy(() => import("./views/masterData/customer/FormCust"));
const LSupp = React.lazy(() =>
  import("./views/masterData/supplier/ListSupplier")
);
const FSupp = React.lazy(() =>
  import("./views/masterData/supplier/FormSupplier")
);
const FormPackaging = React.lazy(() =>
  import("./views/masterData/packaging/FormPackaging")
);
const ListPackaging = React.lazy(() =>
  import("./views/masterData/packaging/ListPackaging")
);
const FormItem = React.lazy(() => import("./views/masterData/item/FormItem"));
const ListItem = React.lazy(() => import("./views/masterData/item/ListItem"));
// SYSTEM
const LAppr = React.lazy(() => import("./views/system/approval/ListApproval"));
const FAppr = React.lazy(() => import("./views/system/approval/FormApproval"));
const LAudit = React.lazy(() => import("./views/system/audit/ListAudit"));
const FAudit = React.lazy(() => import("./views/system/audit/FormAudit"));
const LConf = React.lazy(() => import("./views/system/config/ListConf"));
const FConf = React.lazy(() => import("./views/system/config/FormConf"));
/*
MODULE POINT OF SALES 
*/
const LPReceive = React.lazy(() =>
  import("./features/pos/views/receive/ListReceive")
);
const FPReceive = React.lazy(() =>
  import("./features/pos/views/receive/FormReceive")
);
const LPInbound = React.lazy(() =>
  import("./features/pos/views/inbound/ListInbound")
);
const FPInbound = React.lazy(() =>
  import("./features/pos/views/inbound/FormInbound")
);
const LPSale = React.lazy(() => import("./features/pos/views/sale/ListSale"));
const FPSale = React.lazy(() => import("./features/pos/views/sale/FormSale"));
const LPReturn = React.lazy(() =>
  import("./features/pos/views/return/ListReturn")
);
const FPReturn = React.lazy(() =>
  import("./features/pos/views/return/FormReturn")
);
const LPStock = React.lazy(() =>
  import("./features/pos/views/stock/ListStock")
);
const FPStock = React.lazy(() =>
  import("./features/pos/views/stock/FormStock")
);
const routes = [
  // { path: "/master/user", name: "Master User", element: LUser },
  // { path: "/master/user/:type", name: "Master User", element: FUser },
  // { path: "/master/user/:type/:id", name: "Master User", element: FUser },
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/profile", name: "Profile", element: Profile },
  { path: "/configuration", name: "Configuration", element: Configuration },

  /* 
  MODULE ADMINSTRATOR
  -MASTER
  -SYSTEM
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
  // MASTER DATA
  // CUSTOMER
  {
    path: "/Masterdata/customer",
    name: "Master Data Customer",
    element: LCust,
  },
  {
    path: "/Masterdata/customer/:type",
    name: "Create Customer",
    element: FCust,
  },
  {
    path: "/Masterdata/customer/:type/:id",
    name: "Detail Customer",
    element: FCust,
  },
  // SUPPLIER
  {
    path: "/Masterdata/supplier",
    name: "Master Data Supplier",
    element: LSupp,
  },
  {
    path: "/Masterdata/supplier/:type",
    name: "Create Supplier",
    element: FSupp,
  },
  {
    path: "/Masterdata/supplier/:type/:id",
    name: "Detail Supplier",
    element: FSupp,
  },
  // PACKAGING
  {
    path: "/Masterdata/packaging",
    name: "Master Data Packaging",
    element: ListPackaging,
  },
  {
    path: "/Masterdata/packaging/:type",
    name: "Create Packaging",
    element: FormPackaging,
  },
  {
    path: "/Masterdata/packaging/:type/:id",
    name: "Detail Packaging",
    element: FormPackaging,
  },
  // PACKAGING
  {
    path: "/Masterdata/item",
    name: "Master Data Product",
    element: ListItem,
  },
  {
    path: "/Masterdata/item/:type",
    name: "Create Product",
    element: FormItem,
  },
  {
    path: "/Masterdata/item/:type/:id",
    name: "Detail Product",
    element: FormItem,
  },
  // SYSTEM
  // APPROVAL
  { path: "/system/approval", name: "Master Approval", element: LAppr },
  { path: "/system/approval/:type", name: "Create Approval", element: FAppr },
  {
    path: "/system/approval/:type/:id",
    name: "Detail Approval",
    element: FAppr,
  },
  // AUDIT
  { path: "/system/audit", name: "Master Audit", element: LAudit },
  {
    path: "/system/audit/:type/:id",
    name: "Detail Audit",
    element: FAudit,
  },
  // RELATION CONFIG
  { path: "/system/config-relation", name: "Config Relation", element: LConf },
  {
    path: "/system/config-relation/:type/:id",
    name: "Config Relation",
    element: FConf,
  },

  // FEATURE
  // MODULE POINT OF SALES
  // RECEIVE
  {
    path: "/pos/transaction/receive",
    name: "Receive [Poin Of Sales]",
    element: LPReceive,
  },
  {
    path: "/pos/transaction/receive/:type",
    name: "Detail Receive [Poin Of Sales]",
    element: FPReceive,
  },
  {
    path: "/pos/transaction/receive/:type/:id",
    name: "Detail Receive [Poin Of Sales]",
    element: FPReceive,
  },
  // INBOUND
  {
    path: "/pos/transaction/inbound",
    name: "Inbound",
    element: LPInbound,
  },
  {
    path: "/pos/transaction/inbound/:type/:id",
    name: "Detail Inbound",
    element: FPInbound,
  },
  // SALE
  {
    path: "/pos/transaction/sale",
    name: "Sale List",
    element: LPSale,
  },
  {
    path: "/pos/transaction/sale/:type",
    name: "Create Sale",
    element: FPSale,
  },
  {
    path: "/pos/transaction/sale/:type/:id",
    name: "Detail Sale",
    element: FPSale,
  },
  // SALE
  {
    path: "/pos/transaction/return",
    name: "Return List",
    element: LPReturn,
  },
  {
    path: "/pos/transaction/return/:type",
    name: "Create Return",
    element: FPReturn,
  },
  {
    path: "/pos/transaction/return/:type/:id",
    name: "Detail Return",
    element: FPReturn,
  },
  // STOCK
  {
    path: "/pos/transaction/stock",
    name: "Stock",
    element: LPStock,
  },
  {
    path: "/pos/transaction/stock/:type/:id",
    name: "Detail Stock",
    element: FPStock,
  },
];

export default routes;
