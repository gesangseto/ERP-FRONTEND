import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Dropdown, Layout, Menu, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const AppHeader = (props) => {
  const navigate = useNavigate();
  const { onChangeCollapsed, isCollapsed } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState({});

  const menu = () => {
    return (
      <Menu
        items={[
          {
            key: "0",
            label: (
              <a>
                <UserOutlined />
                &nbsp;{profile.user_name}
              </a>
            ),
          },
          {
            key: "1",
            label: (
              <a>
                <SettingOutlined />
                &nbsp;Proffile
              </a>
            ),
          },
          {
            key: "4",
            danger: true,
            label: (
              <a onClick={() => handleLogout()}>
                <LogoutOutlined />
                &nbsp;Logout
              </a>
            ),
          },
        ]}
      />
    );
  };

  useEffect(() => {
    if (onChangeCollapsed) {
      onChangeCollapsed(collapsed);
    }
  }, [collapsed]);

  useEffect(() => {
    let prfl = JSON.parse(localStorage.getItem("profile"));
    if (prfl) {
      setProfile({ ...prfl });
    } else {
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("profile");
    localStorage.removeItem("menu");
    navigate("Login");
  };

  return (
    <Header
      className="site-layout-background"
      style={{
        padding: "0",
        height: "64px",
        width: "100%",
        position: "sticky",
        zIndex: 1,
        top: 0,
      }}
    >
      <Row style={{ marginInline: 30 }}>
        <Col span={12}>
          {isCollapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: "20px" }}
              onClick={() => setCollapsed(!isCollapsed)}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: "20px" }}
              onClick={() => setCollapsed(!isCollapsed)}
            />
          )}
        </Col>
        <Col span={12}>
          {/* <Dropdown overlay={menu()} trigger={["click", "hover"]}>
            <Avatar
              icon={
                <UserOutlined
                  type="button"
                  style={{ fontSize: "20px", color: "#08c" }}
                  theme="outlined"
                  onClick={(e) => e.preventDefault()}
                />
              }
              style={{
                margin: 15,
                float: "right",
              }}
            />
          </Dropdown> */}
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;
