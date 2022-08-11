import { Layout, Menu, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reformatMenu } from "helper/utils";

const { Sider } = Layout;

const AppSidebar = (props) => {
  const navigate = useNavigate();
  const { isCollapsed, menuItem } = props;
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([1]);
  const [menuApi, setMenuApi] = useState([]);

  useEffect(() => {
    if (menuItem.length > 0) {
      setMenuApi([...menuItem]);
      let menu = reformatMenu(menuItem);
      setMenuItems([...menu]);
    }
  }, [menuItem]);

  const handleClickMenu = (e) => {
    let getMenu = menuApi.findIndex((x) => x.sys_menu_id == e.key);
    if (getMenu >= 0) {
      navigate(menuApi[getMenu].sys_menu_url);
      setSelectedMenu([...e.keyPath]);
    }
  };

  return (
    <Sider
      breakpoint="xl"
      trigger={null}
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
      <div
        className="logo"
        style={{
          height: "60px",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        <Typography.Title level={4} style={{ color: "white" }}>
          {isCollapsed
            ? menuItem[0].sys_menu_module_name.charAt(0)
            : menuItem[0].sys_menu_module_name}
        </Typography.Title>
      </div>
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
