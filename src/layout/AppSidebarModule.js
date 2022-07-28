import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { icon } from "../constants";
import { groupBy, reformatMenu } from "../helper/utils";

const { Sider } = Layout;

const AppSidebarModule = (props) => {
  const navigate = useNavigate();
  const { isCollapsed, changeMenu } = props;
  const [module, setModule] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([1]);
  const [profile, setProfile] = useState({
    ...JSON.parse(localStorage.getItem("profile")),
  });

  useEffect(() => {
    let menu = JSON.parse(localStorage.getItem("menu"));
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
  }, []);

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
