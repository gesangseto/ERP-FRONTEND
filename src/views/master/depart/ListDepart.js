import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { XButton, XTable } from "../../../component";
import { defaultFilter } from "../../../constants";
import { deleteDepartment, getDepartment } from "../../../resource";
import routes from "../../../routes";

const ListDepart = () => {
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
    let _data = await getDepartment(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action == "delete") {
      if (await deleteDepartment({ user_department_id: id })) {
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
        rowKey="user_department_id"
        columns={departColumns()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListDepart;

const departColumns = () => {
  return [
    {
      title: "ID",
      key: "user_department_id",
    },
    {
      title: "Code",
      key: "user_department_code",
    },
    {
      title: "Name",
      key: "user_department_name",
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
      key: "user_department_id",
      action: ["approve", "update", "read", "delete"],
    },
  ];
};
