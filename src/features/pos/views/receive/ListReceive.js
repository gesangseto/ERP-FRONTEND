import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XButton, XTable } from "../../../../component";
import { defaultFilter } from "../../../../constants";
import { getReceive } from "../../resource";

import moment from "moment";
import { getRoute } from "../../../../helper/utils";

const ListReceive = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getReceive(filter);
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
        rowKey="pos_receive_id"
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
      key: "pos_receive_id",
    },
    {
      title: "Date",
      key: "created_at",
      render: (i, rec) => <p>{moment(i).format("YYYY-MM-DD hh:mm:ss")}</p>,
    },
    {
      title: "Created By",
      key: "user_name",
    },
    {
      title: "Product",
      key: "mst_item_name",
    },
    {
      title: "Supplier",
      key: "mst_supplier_name",
    },
    {
      title: "Batch",
      key: "batch",
    },
    {
      title: "Quantity",
      key: "qty",
    },
    {
      title: "Status",
      key: "status",
      render: (i, rec) => (
        <p
          style={{
            color:
              rec.status == 1 ? "green" : rec.status == -1 ? "blue" : "red",
          }}
        >
          {rec.status == 1
            ? "Active"
            : rec.status == -1
            ? "Rejected"
            : "Inactive"}
        </p>
      ),
    },
    {
      title: "",
      key: "pos_receive_id",
      action: ["approve", "update", "read"],
    },
  ];
};
