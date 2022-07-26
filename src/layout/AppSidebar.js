import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reformatMenu } from "../helper/utils";

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
