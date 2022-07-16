import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Dropdown, Layout, Menu, Row } from "antd";
import React, { useEffect, useState } from "react";

const { Header } = Layout;

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.antgroup.com"
          >
            Profile
          </a>
        ),
      },
      {
        key: "4",
        danger: true,
        label: "Logout",
      },
    ]}
  />
);

const AppHeader = (props) => {
  const { onChangeCollapsed, isCollapsed } = props;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (onChangeCollapsed) {
      onChangeCollapsed(collapsed);
    }
  }, [collapsed]);

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
          <Dropdown overlay={menu} trigger={["click", "hover"]}>
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
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

export default AppHeader;
