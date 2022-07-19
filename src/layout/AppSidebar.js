import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Anchor } from "antd";
import React, { useEffect, useState } from "react";
import { makeId, makeString, reformatMenu } from "../helper/utils";
import {
  useNavigate,
  useLocation,
  matchRoutes,
  useParams,
} from "react-router-dom";
import routes from "../routes";

const { Sider } = Layout;
const { Link } = Anchor;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${makeString(5)}`,
  children: [
    getItem(makeString(5), makeId(5)),
    getItem(makeString(5), makeId(5)),
    getItem(makeString(5), makeId(5)),
  ],
}));

const items_old = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const AppSidebar = (props) => {
  // let { type, id } = useParams();
  // const match = { params: useParams() };
  // const location = useLocation();
  // const [{ route }] = matchRoutes(routes, location);
  const navigate = useNavigate();
  const { isCollapsed } = props;
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([1]);
  const [menuApi, setMenuApi] = useState([]);

  useEffect(() => {
    let menu = JSON.parse(localStorage.getItem("menu"));
    if (menu) {
      setMenuApi([...menu]);
      menu = reformatMenu(menu);
      setMenuItems([...menu]);
    }
  }, []);

  useEffect(() => {
    // let idxMenu = selectedMenu[0];
    // let menu = JSON.parse(localStorage.getItem("menu"));
    // // console.log("type", type);
    // console.log(menu[idxMenu]);
    // console.log(match);
  }, []);

  const handleClickMenu = (e) => {
    let getMenu = menuApi.findIndex((x) => x.sys_menu_id == e.key);
    if (getMenu >= 0) {
      navigate(menuApi[getMenu].sys_menu_url);
      setSelectedMenu([...e.keyPath]);
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={isCollapsed}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <div className="logo" style={{ height: "60px" }} />
      <Menu
        theme="dark"
        defaultSelectedKeys={selectedMenu}
        mode="inline"
        items={menuItems}
        onClick={(e) => handleClickMenu(e)}
      />
    </Sider>
  );
};

export default AppSidebar;
