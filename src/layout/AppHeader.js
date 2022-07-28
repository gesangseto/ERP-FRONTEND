import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Dropdown, Layout, Menu, Row, Typography } from "antd";
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
        <Col span={10}>
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
        <Col span={4}>
          <Typography.Title level={4} style={{ marginTop: 15 }}>
            {profile.app_name}
          </Typography.Title>
        </Col>
        <Col span={10}>
          <Avatar
            icon={<img src={profile.app_logo} />}
            style={{
              margin: 15,
              float: "right",
            }}
          />
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;
