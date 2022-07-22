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
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  matchRoutes,
} from "react-router-dom";
import { findOnArr, makeId, makeString, reformatMenu } from "../helper/utils";
import routes from "../routes";

const { Sider } = Layout;

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
  let { type, id } = useParams();
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);
  const navigate = useNavigate();
  const { isCollapsed } = props;
  const [profile, setProfile] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([1]);
  const [menuApi, setMenuApi] = useState([]);

  useEffect(() => {
    let menu = JSON.parse(localStorage.getItem("menu"));
    let prfl = JSON.parse(localStorage.getItem("profile"));
    if (menu) {
      setMenuApi([...menu]);
      menu = reformatMenu(menu);
      setMenuItems([...menu]);
    }
    if (prfl) {
      setProfile({ ...prfl });
    }
  }, []);

  useEffect(() => {
    // let idxMenu = selectedMenu[0];
    let menu = JSON.parse(localStorage.getItem("menu"));
    // findOnArr({});
    let haveRole = false;
    for (const it of menu) {
      let path = route.path.toLowerCase();
      let url = it.sys_menu_url.toLowerCase();
      if (path.includes(url)) {
        // console.log(type);
        // console.log(`it[flag_${type}]`, it[`flag_${type}`]);
        if (it[`flag_${type}`]) {
          haveRole = true;
        }
      }
    }
    if (!haveRole) {
      // navigate("/404");
    }
    console.log(route.path.includes("M"));
    console.log(menu);
    // console.log("type", type);
    // console.log(menu[idxMenu]);
    // console.log(match);
  }, [type]);

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
