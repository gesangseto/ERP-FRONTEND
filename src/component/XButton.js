import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Popover, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import routes from "../routes";

const XButton = (props) => {
  const { title, popover, type, record, use_permission = true } = props;
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);
  const [icon, setIcon] = useState();
  const [permission, setPermission] = useState({});
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let menu = JSON.parse(localStorage.getItem("menu"));
    let getMenu = menu.findIndex(
      (x) => x.sys_menu_url.toLowerCase() == route.path.toLowerCase()
    );
    switch (type) {
      case "approve":
        menu[getMenu].flag_approve = 1;
        setIcon(<CheckCircleOutlined style={{ color: "#5aa832" }} />);
        break;
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
    setPermission({ ...menu[getMenu] });
  }, [type, popover]);

  useEffect(() => {
    let hidden = false;
    let profile = JSON.parse(localStorage.getItem("profile"));
    if ((type && permission[`flag_${type}`]) || !use_permission) {
      hidden = false;
    } else {
      hidden = true;
    }

    if (type == "approve" && record) {
      if (record.hasOwnProperty("approval")) {
        let approval = record.approval;
        if (approval && approval.approval_current_user_id) {
          if (
            approval.approval_current_user_id != profile.user_id &&
            profile.user_id != 0
          ) {
            hidden = true;
          }
        }
        if (!approval) {
          hidden = true;
        } else if (approval.is_approve) {
          hidden = true;
        }

        console.log(approval);
      }
    }
    setIsHidden(hidden);
  }, [props]);

  const renderButton = () => {
    return (
      <>
        {!isHidden ? (
          <Button size="medium" {...props}>
            {icon}
            {title}
          </Button>
        ) : null}
      </>
    );
  };

  return (
    <>
      {popover ? (
        <Popover content={popover}>{renderButton()}</Popover>
      ) : (
        renderButton()
      )}
    </>
  );
};

export default XButton;
