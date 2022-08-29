import { Card, Tag } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getDestroy } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute, toDate } from "helper/utils";

const ListDestroy = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getDestroy(filter);
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

export default ListDestroy;

const columns = () => {
  return [
    {
      title: "Branch",
      key: "pos_branch_code",
    },
    {
      title: "Date",
      key: "created_at",
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
      title: "Destroyed Status",
      key: "is_destroyed",
      cell: (rec) => {
        let color = "yellow";
        let title = "Not Destroyed";
        if (rec.is_destroyed) {
          color = "green";
          title = "Destroyed";
        } else if (rec.is_destroyed == false) {
          color = "red";
          title = "Rejected";
        }
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "",
      key: "pos_trx_destroy_id",
      action: ["approve", "update", "read"],
    },
  ];
};
