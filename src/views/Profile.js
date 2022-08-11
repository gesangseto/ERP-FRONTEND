import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});

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
    <Card>
      <Row>
        <Col
          span={4}
          style={{
            justifyContent: "center",
            display: "flex",
            // backgroundColor: "red",
          }}
        >
          <Avatar
            size={150}
            icon={
              <UserOutlined
                type="button"
                style={{ fontSize: "150", color: "#08c" }}
                theme="outlined"
              />
            }
            style={{ alignSelf: "center" }}
          />
        </Col>
        <Col span={10}>
          <Row>
            <Col span={10}>
              <Title level={5}>Username</Title>
            </Col>
            <Col span={14}>
              <Text>{profile.user_name}</Text>
            </Col>
            <Col span={10}>
              <Title level={5}>Fullname</Title>
            </Col>
            <Col span={14}>
              <Text>{profile.user_full_name}</Text>
            </Col>
            <Col span={10}>
              <Title level={5}>Email</Title>
            </Col>
            <Col span={14}>
              <Text>{profile.user_email}</Text>
            </Col>
            <Col span={10}>
              <Title level={5}>Phone</Title>
            </Col>
            <Col span={14}>
              <Text>{profile.user_phone}</Text>
            </Col>
            <Col span={10}>
              <Title level={5}>Address</Title>
            </Col>
            <Col span={14}>
              <Text>{profile.user_address}</Text>
            </Col>
          </Row>
        </Col>
        <Col span={10}></Col>
      </Row>
      <div
        className="logo"
        style={{
          height: "60px",
          justifyContent: "center",
          display: "flex",
        }}
      ></div>
    </Card>
  );
};

export default Profile;
