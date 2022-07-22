import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { icon } from "../constants";
import { groupBy, reformatMenu } from "../helper/utils";
import routes from "../routes";

const { Sider } = Layout;

const AppSidebarModule = (props) => {
  let { type, id } = useParams();
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);
  const navigate = useNavigate();
  const { isCollapsed } = props;
  const [profile, setProfile] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [module, setModule] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([1]);
  const [menuApi, setMenuApi] = useState([]);

  useEffect(() => {
    let menu = JSON.parse(localStorage.getItem("menu"));
    let prfl = JSON.parse(localStorage.getItem("profile"));
    if (menu) {
      let grp = groupBy(menu, "sys_menu_module_name");
      let group = [];
      for (const key in grp) {
        let it = {
          key: key,
          label: key,
          icon: icon.BarChartOutlined ?? null,
        };
        group.push(it);
      }
      setModule([...group]);
      console.log(group);
      setMenuApi([...menu]);
      menu = reformatMenu(menu);

      setMenuItems([...menu]);
    }
  }, []);

  return (
    <Sider
      theme="light"
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
        theme="light"
        defaultSelectedKeys={selectedMenu}
        mode="inline"
        items={module}
        // onClick={(e) => handleClickMenu(e)}
      />
    </Sider>
  );
};

export default AppSidebarModule;
