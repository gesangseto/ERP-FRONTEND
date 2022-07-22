import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { XButton, XTable } from "../../../component";
import { defaultFilter } from "../../../constants";
import { departColumns } from "../../../constants/columnTable";
import {
  deleteDepartment,
  getApproval,
  getDepartment,
} from "../../../resource";
import routes from "../../../routes";

const ListApproval = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getApproval(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action == "delete") {
      if (await deleteDepartment({ approval_id: id })) {
        loadData();
        toast.success(`Delete id ${id} successfully`);
      }
      return;
    }
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
        rowKey="approval_id"
        columns={tableSchema()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListApproval;

const tableSchema = () => {
  return [
    {
      title: "ID",
      key: "approval_id",
    },
    {
      title: "Approval",
      key: "approval_desc",
    },
    {
      title: "Approval 1",
      key: "approval_user_name_1",
    },
    {
      title: "Approval 2",
      key: "approval_user_name_2",
    },
    {
      title: "Approval 3",
      key: "approval_user_name_3",
    },
    {
      title: "Approval 4",
      key: "approval_user_name_4",
    },
    {
      title: "Approval 5",
      key: "approval_user_name_5",
    },
    {
      title: "Status",
      key: "status",
      render: (i, rec) => (
        <p style={{ color: rec.status ? "green" : "red" }}>
          {rec.status ? "Active" : "Inactive"}
        </p>
      ),
    },
    {
      title: "",
      key: "approval_id",
      action: ["approve", "delete", "update", "read"],
    },
  ];
};
