import { Card, Tag } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getReceiveByUser } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute, toDate } from "helper/utils";

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
    let _data = await getReceiveByUser(filter);
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
      <XTableV2
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
      title: "Branch",
      key: "pos_branch_code",
    },
    {
      title: "Date",
      cell: (it) => toDate(it.created_at),
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
      title: "Quantity",
      key: "qty",
    },
    {
      title: "@ Quantity",
      key: "qty_stock",
    },
    {
      title: "Status",
      key: "status",
    },
    {
      title: "Received Status",
      key: "is_received",
      cell: (it) => {
        let color = "yellow";
        let title = "Not Received";
        if (it.is_received) {
          color = "green";
          title = "Received";
        } else if (it.is_received == false) {
          color = "red";
          title = "Rejected";
        }
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "",
      key: "pos_receive_id",
      action: ["approve", "update", "read"],
    },
  ];
};
