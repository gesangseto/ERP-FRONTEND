import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import React, { useEffect, useState } from "react";

const XButton = (props) => {
  const { title, popover, type } = props;
  const [icon, setIcon] = useState();

  useEffect(() => {
    switch (type) {
      case "create":
        setIcon(<PlusOutlined style={{ color: "green" }} />);
        break;
      case "read":
        setIcon(<EyeOutlined style={{ color: "blue" }} />);
        break;
      case "update":
        setIcon(<EditOutlined style={{ color: "#ebc234" }} />);
        break;
      case "delete":
        setIcon(<DeleteOutlined style={{ color: "red" }} />);
        break;
      default:
        break;
    }
  }, [type]);

  const renderButton = () => {
    return (
      <Button size="medium" {...props}>
        {icon}
        {title}
      </Button>
    );
  };
  return (
    <>
      {popover ? (
        <Popover content={<>{popover}</>}>{renderButton()}</Popover>
      ) : (
        renderButton()
      )}
    </>
  );
};

export default XButton;
