import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { XButton, XTable } from "../../../component";
import { defaultFilter } from "../../../constants";
import { deleteCustomer, getCustomer } from "../../../resource";
import routes from "../../../routes";

const ListReceive = () => {
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
    let _data = await getCustomer(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action == "delete") {
      if (await deleteCustomer({ mst_customer_id: id })) {
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
        rowKey="mst_customer_id"
        columns={columns()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListReceive;

const columns = () => {
  return [
    {
      title: "ID",
      key: "mst_customer_id",
    },
    {
      title: "PIC",
      key: "mst_customer_pic",
    },
    {
      title: "Name",
      key: "mst_customer_name",
    },
    {
      title: "Email",
      key: "mst_customer_email",
    },
    {
      title: "Phone",
      key: "mst_customer_phone",
    },
    {
      title: "Address",
      key: "mst_customer_address",
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
      key: "mst_customer_id",
      action: ["approve", "update", "read", "delete"],
    },
  ];
};
