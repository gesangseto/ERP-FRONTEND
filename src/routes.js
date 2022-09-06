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

var path = "./views/master/";
const LDepart = React.lazy(() => import(path + "depart/ListDepart"));
const FDepart = React.lazy(() => import(path + "depart/FormDepart"));
const LSection = React.lazy(() => import(path + "section/ListSection"));
const FSection = React.lazy(() => import(path + "section/FormSection"));
const FRole = React.lazy(() => import(path + "role/FormRole"));
const LRole = React.lazy(() => import(path + "role/ListRole"));
const ListUser = React.lazy(() => import(path + "user/ListUser"));
const FormUser = React.lazy(() => import(path + "user/FormUser"));
// MASTER Data
var path = "./views/masterData/";
const LCust = React.lazy(() => import(path + "customer/ListCust"));
const FCust = React.lazy(() => import(path + "customer/FormCust"));
const LSupp = React.lazy(() => import(path + `supplier/ListSupplier`));
const FSupp = React.lazy(() => import(path + "supplier/FormSupplier"));
const FormPackaging = React.lazy(() =>
  import(path + "packaging/FormPackaging")
);
const ListPackaging = React.lazy(() =>
  import(path + "packaging/ListPackaging")
);
const FormItem = React.lazy(() => import(path + "item/FormItem"));
const ListItem = React.lazy(() => import(path + "item/ListItem"));
// SYSTEM

var path = "./views/system/";
const LAppr = React.lazy(() => import(path + "approval/ListApproval"));
const FAppr = React.lazy(() => import(path + "approval/FormApproval"));
const LAudit = React.lazy(() => import(path + "audit/ListAudit"));
const FAudit = React.lazy(() => import(path + "audit/FormAudit"));
const LConf = React.lazy(() => import(path + "config/ListConf"));
const FConf = React.lazy(() => import(path + "config/FormConf"));
/*
MODULE POINT OF SALES 
*/
var path = "./features/pos/views/";
const LPBranch = React.lazy(() => import(path + "branch/ListBranch"));
const FPBranch = React.lazy(() => import(path + "branch/FormBranch"));
const LPUserBranch = React.lazy(() =>
  import(path + "userBranch/ListUserBranch")
);
const FPUserBranch = React.lazy(() =>
  import(path + "userBranch/FormUserBranch")
);
const LPDiscount = React.lazy(() => import(path + "discount/ListDiscount"));
const FPDiscount = React.lazy(() => import(path + "discount/FormDiscount"));
const LPReceive = React.lazy(() => import(path + "receive/ListReceive"));
const FPReceive = React.lazy(() => import(path + "receive/FormReceive"));
const LPInbound = React.lazy(() => import(path + "inbound/ListInbound"));
const FPInbound = React.lazy(() => import(path + "inbound/FormInbound"));
const LPSale = React.lazy(() => import(path + "sale/ListSale"));
const FPSale = React.lazy(() => import(path + "sale/FormSale"));
const LPReturn = React.lazy(() => import(path + "return/ListReturn"));
const FPReturn = React.lazy(() => import(path + "return/FormReturn"));
const LPDestroy = React.lazy(() => import(path + "destroy/ListDestroy"));
const FPDestroy = React.lazy(() => import(path + "destroy/FormDestroy"));
const LPStock = React.lazy(() => import(path + "stock/ListStock"));
const FPStock = React.lazy(() => import(path + "stock/FormStock"));
const LPRSale = React.lazy(() => import(path + "reportSale/ListReportSale"));
const FPRSale = React.lazy(() => import(path + "reportSale/FormReportSale"));
/*
MODULE WAREHOUSE 
*/
var path = "./features/warehouse/views/";
const LWBranch = React.lazy(() => import(path + "branch/ListBranch"));
const FWBranch = React.lazy(() => import(path + "branch/FormBranch"));
const LWWhType = React.lazy(() => import(path + "wh-type/ListWhType"));
const FWWhType = React.lazy(() => import(path + "wh-type/FormWhType"));

const routes = [
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
  // BRANCH
  {
    path: "/pos/master/branch",
    name: "Branch List",
    element: LPBranch,
  },
  {
    path: "/pos/master/branch/:type",
    name: "Branch Detail",
    element: FPBranch,
  },
  {
    path: "/pos/master/branch/:type/:id",
    name: "Branch Detail",
    element: FPBranch,
  },
  // USER BRANCH
  {
    path: "/pos/master/user-branch",
    name: "User Branch List",
    element: LPUserBranch,
  },
  {
    path: "/pos/master/user-branch/:type",
    name: "User Branch Detail",
    element: FPUserBranch,
  },
  {
    path: "/pos/master/user-branch/:type/:id",
    name: "User Branch Detail",
    element: FPUserBranch,
  },
  // DISCOUNT
  {
    path: "/pos/master/discount",
    name: "Discount List",
    element: LPDiscount,
  },
  {
    path: "/pos/master/discount/:type",
    name: "Discount Detail",
    element: FPDiscount,
  },
  {
    path: "/pos/master/discount/:type/:id",
    name: "Discount Detail",
    element: FPDiscount,
  },
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
  // RETURN
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
  // DESTROY
  {
    path: "/pos/transaction/destroy",
    name: "Destroy List",
    element: LPDestroy,
  },
  {
    path: "/pos/transaction/destroy/:type",
    name: "Create Destroy",
    element: FPDestroy,
  },
  {
    path: "/pos/transaction/destroy/:type/:id",
    name: "Detail Destroy",
    element: FPDestroy,
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
  // STOCK
  {
    path: "/pos/report/sale",
    name: "Report Sale",
    element: LPRSale,
  },
  {
    path: "/pos/report/sale/:type/:id",
    name: "Detail Report Sale",
    element: FPRSale,
  },
  // FEATURE
  // MODULE WAREHOUSE
  // BRANCH
  {
    path: "/warehouse/master/branch",
    name: "Branch List",
    element: LWBranch,
  },
  {
    path: "/warehouse/master/branch/:type",
    name: "Branch Detail",
    element: FWBranch,
  },
  {
    path: "/warehouse/master/branch/:type/:id",
    name: "Branch Detail",
    element: FWBranch,
  },
  // Warehouse Type
  {
    path: "/warehouse/master/wh-type",
    name: "Wh Type List",
    element: LWWhType,
  },
  {
    path: "/warehouse/master/wh-type/:type",
    name: "Wh Type Detail",
    element: FWWhType,
  },
  {
    path: "/warehouse/master/wh-type/:type/:id",
    name: "Wh Type Detail",
    element: FWWhType,
  },
];

export default routes;
