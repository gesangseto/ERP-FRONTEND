import { Card } from "antd";
import { XButton, XTable } from "component";
import { defaultFilter } from "constants";
import { getDiscountByUser } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute } from "helper/utils";
import moment from "moment";

const ListDiscount = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getDiscountByUser(filter);
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
        rowKey="pos_discount_id"
        columns={columns()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListDiscount;

const columns = () => {
  return [
    {
      title: "Date",
      key: "created_at",
      render: (i, rec) => <p>{moment(i).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: "Created By",
      key: "user_name",
    },
    {
      title: "Branch Code",
      key: "pos_branch_code",
    },
    {
      title: "Product",
      key: "mst_item_name",
    },
    {
      title: "Barcode",
      key: "barcode",
    },
    {
      title: "Variant",
      key: "mst_item_variant_name",
    },
    {
      title: "Start",
      key: "pos_discount_starttime",
      render: (i, rec) => <p>{moment(i).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: "End",
      key: "pos_discount_endtime",
      render: (i, rec) => <p>{moment(i).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: "Status",
      key: "status",
      render: (i, rec) => (
        <p
          style={{
            color: rec.status == 1 ? "green" : "red",
          }}
        >
          {rec.status == 1 ? "Active" : "Inactive"}
        </p>
      ),
    },
    {
      title: "",
      key: "pos_discount_id",
      action: ["approve", "update", "read"],
    },
  ];
};
