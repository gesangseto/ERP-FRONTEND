import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Popover } from "antd";
import { icon } from "constants";
import { groupBy } from "helper/utils";
import { useEffect, useState } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import routes from "routes";

const { Sider } = Layout;

const AppSidebarModule = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);
  const { isCollapsed, changeMenu } = props;
  const [module, setModule] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([1]);
  const [profile, setProfile] = useState({});
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    checkPermission();
  }, [route]);

  useEffect(() => {
    if (menu.length > 0) {
      loadMenuModule();
    }
  }, [menu]);

  useEffect(() => {
    let storageProfile = localStorage.getItem("profile");
    let storageMenu = localStorage.getItem("menu");
    if (!storageProfile || !storageMenu) {
      return handleLogout();
    } else {
      setMenu([...JSON.parse(storageMenu)]);
      setProfile({ ...JSON.parse(storageProfile) });
    }
  }, []);

  const loadMenuModule = () => {
    if (menu) {
      let grp = groupBy(menu, "sys_menu_module_code");
      let group = [];
      for (const key in grp) {
        let it = {
          key: key,
          label: grp[key][0].sys_menu_module_name,
          icon: icon[grp[key][0].sys_menu_module_icon] ?? null,
        };
        group.push(it);
      }
      setModule([...group]);
    }
  };

  const checkPermission = () => {
    let storageMenu = localStorage.getItem("menu");
    if (!storageMenu) {
      return handleLogout();
    }
    storageMenu = JSON.parse(storageMenu);
    let path = route.path.split(":");
    if (path[0]) {
      let can_access = false;
      let method = location.pathname.replace(path[0], "");
      method = method.split("/")[0];
      for (const it of storageMenu) {
        let permission = it.sys_menu_url.replace(/\//g, "").toLowerCase();
        let access = path[0].replace(/\//g, "").toLowerCase();
        if (permission === access || access == "profile") {
          if (method && it[`flag_${method}`] === 1) {
            can_access = true;
          } else {
            can_access = true;
          }
        }
      }
      if (!can_access && profile.user_id != 0) {
        navigate("/404");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("profile");
    localStorage.removeItem("menu");
    navigate("Login");
  };

  const handleClickMenu = (e) => {
    let _menu = JSON.parse(localStorage.getItem("menu"));
    let module_menu = [];
    for (const it of _menu) {
      if (it.sys_menu_module_code === e.key) {
        module_menu.push(it);
      }
    }
    if (changeMenu) {
      changeMenu(module_menu);
    }
  };
  return (
    <Sider
      theme="light"
      trigger={
        <Popover content="Logout" placement="right" trigger="hover">
          <LogoutOutlined
            type="button"
            style={{ fontSize: "20px", color: "#08c" }}
            theme="outlined"
            onClick={(e) => handleLogout(e)}
          />
        </Popover>
      }
      collapsible
      collapsedWidth={50}
      collapsed={isCollapsed}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <Popover content="Profile" placement="right" trigger="hover">
        <div
          style={{
            height: "60px",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Avatar
            icon={
              <UserOutlined
                type="button"
                style={{ fontSize: "20px", color: "#08c" }}
                theme="outlined"
                onClick={(e) => navigate("/Profile")}
              />
            }
            style={{
              alignSelf: "center",
            }}
          />
        </div>
      </Popover>
      <Menu
        theme="light"
        defaultSelectedKeys={selectedMenu}
        mode="inline"
        items={module}
        onClick={(e) => handleClickMenu(e)}
      />
      {profile.hasOwnProperty("user_id") && profile.user_id == "0" ? (
        <Popover content="Configuration" placement="right" trigger="hover">
          <SettingOutlined
            type="button"
            style={{
              fontSize: "20px",
              color: "#08c",
              height: "60px",
              justifyContent: "center",
              display: "flex",
              paddingTop: 20,
            }}
            theme="outlined"
            onClick={(e) => navigate("/Configuration")}
          />
        </Popover>
      ) : null}
    </Sider>
  );
};

export default AppSidebarModule;
