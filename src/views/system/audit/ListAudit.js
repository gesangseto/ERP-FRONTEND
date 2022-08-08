import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XTable } from "component";
import { defaultFilter } from "constants";
import { getRoute } from "helper/utils";
import { getAudit } from "resource";

const ListAudit = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getAudit(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    navigate(`${route.path}/${action}/${id}`);
  };
  return (
    <Card
      title={route.name}
      style={{ textTransform: "capitalize" }}
      // extra={
      //   <XButton
      //     popover="Create"
      //     type="create"
      //     onClick={() => handleClickAdd()}
      //   />
      // }
    >
      <XTable
        rowKey="id"
        columns={tableSchema()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListAudit;

const tableSchema = () => {
  return [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Username",
      key: "user_name",
    },
    {
      title: "Email",
      key: "user_email",
    },
    {
      title: "PATH",
      key: "path",
    },
    {
      title: "Type",
      key: "type",
    },
    {
      title: "IP",
      key: "ip_address",
    },
    {
      title: "Agent",
      key: "user_agent",
    },
    {
      title: "",
      key: "id",
      action: ["read"],
    },
  ];
};
