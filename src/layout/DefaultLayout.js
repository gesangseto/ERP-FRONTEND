import { Layout } from "antd";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routes from "routes";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import AppSidebarModule from "./AppSidebarModule";
const { Content } = Layout;

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sideMenu, setSideMenu] = useState([]);

  return (
    <Layout>
      <AppSidebarModule
        isCollapsed={true}
        changeMenu={(e) => setSideMenu([...e])}
      />
      {sideMenu.length > 0 ? (
        <AppSidebar
          isCollapsed={collapsed}
          onChangeCollapsed={(e) => setCollapsed(e)}
          menuItem={sideMenu}
        />
      ) : null}

      <Layout className="site-layout">
        <AppHeader
          className="site-layout-background"
          isCollapsed={collapsed}
          onChangeCollapsed={(e) => setCollapsed(e)}
        />
        <Content
          style={{
            margin: "30px 30px",
            overflow: "initial",
          }}
        >
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              );
            })}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
