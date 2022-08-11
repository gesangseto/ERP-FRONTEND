import { Button, Card, Col, Row, Statistic } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import React from "react";
const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

const Dashboard = () => {
  const onFinish = () => {
    console.log("finished!");
  };

  const onChange = (val) => {
    if (4.95 * 1000 < val && val < 5 * 1000) {
      console.log("changed!");
    }
  };

  return (
    <Card>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="Active Users" value={112893} />
        </Col>
        <Col span={6}>
          <Statistic
            title="Account Balance (CNY)"
            value={112893}
            precision={2}
          />
          <Button
            style={{
              marginTop: 16,
            }}
            type="primary"
          >
            Recharge
          </Button>
        </Col>
        <Col span={6}>
          <Statistic title="Active Users" value={112893} loading />
        </Col>
      </Row>{" "}
      <Row gutter={16}>
        <Col span={12}>
          <Countdown title="Countdown" value={deadline} onFinish={onFinish} />
        </Col>
        <Col span={12}>
          <Countdown
            title="Million Seconds"
            value={deadline}
            format="HH:mm:ss:SSS"
          />
        </Col>
        <Col
          span={24}
          style={{
            marginTop: 32,
          }}
        >
          <Countdown
            title="Day Level"
            value={deadline}
            format="D 天 H 时 m 分 s 秒"
          />
        </Col>
        <Col span={12}>
          <Countdown
            title="Countdown"
            value={Date.now() + 10 * 1000}
            onChange={onChange}
          />
        </Col>
      </Row>{" "}
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{
                color: "#3f8600",
              }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{
                color: "#cf1322",
              }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Dashboard;
