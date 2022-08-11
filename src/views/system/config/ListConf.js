import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { XButton, XTable } from "component";
import { defaultFilter } from "constants";
import { getRoute } from "helper/utils";
import { deleteApproval, getApproval, getConfigRelation } from "resource";

const ListConf = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getConfigRelation(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    navigate(`${route.path}/${action}/${id}`);
  };
  const handleClickAdd = () => {
    navigate(`${route.path}/create`);
  };
  return (
    <Card
      title={route.name}
      style={{ textTransform: "capitalize" }}
      extra={
        <XButton
          popover="Create"
          type="create"
          onClick={() => handleClickAdd()}
        />
      }
    >
      <XTable
        rowKey="sys_relation_id"
        columns={tableSchema()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListConf;

const tableSchema = () => {
  return [
    {
      title: "ID",
      key: "sys_relation_id",
    },
    {
      title: "Name",
      key: "sys_relation_name",
    },
    {
      title: "Desc",
      key: "sys_relation_desc",
    },
    {
      title: "Ref Id",
      key: "sys_relation_ref_id",
    },
    {
      title: "",
      key: "sys_relation_id",
      action: ["approve", "update", "read"],
    },
  ];
};
