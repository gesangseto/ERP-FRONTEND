import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { canApprove, getRoute } from "helper/utils";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import routes from "routes";

const XButton = (props) => {
  const {
    title,
    popover,
    type,
    record,
    use_permission = true,
    ...rest
  } = props;
  const routee = getRoute();
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);
  const [icon, setIcon] = useState();
  const [permission, setPermission] = useState({});
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let menu = JSON.parse(localStorage.getItem("menu"));
    let path = route.path.split(":")[0];
    let index = menu.findIndex(
      (x) =>
        x.sys_menu_url.toLowerCase().replace(/\/$/, "") ==
        path.toLowerCase().replace(/\/$/, "")
    );
    switch (type) {
      case "approve":
        menu[index].flag_approve = 1;
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
    setPermission({ ...menu[index] });
  }, [type, popover]);

  useEffect(() => {
    let hidden = false;
    if ((type && permission[`flag_${type}`]) || use_permission == "false") {
      hidden = false;
    } else {
      hidden = true;
    }
    // APPROVAL BUTTON
    if (type == "approve" && record) {
      if (record.hasOwnProperty("approval")) {
        let approval = record.approval;
        if (canApprove(approval)) {
          hidden = false;
        } else {
          hidden = true;
        }
      } else {
        hidden = true;
      }
    }
    setIsHidden(hidden);
  }, [props, permission]);

  const renderButton = () => {
    return (
      <>
        {!isHidden ? (
          <Button size="small" {...rest}>
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
