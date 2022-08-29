import { Card } from "antd";
import { XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getInboundByUser } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute, toDate } from "helper/utils";

const ListInbound = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getInboundByUser(filter);
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
      // extra={
      //   <XButton
      //     popover="Create"
      //     type="create"
      //     onClick={() => handleClickAdd()}
      //   />
      // }
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

export default ListInbound;

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
      title: "Type",
      key: "pos_trx_inbound_type",
    },
    {
      title: "Source",
      key: "pos_trx_inbound_id",
      cell: (it) =>
        it.mst_supplier_name ? it.mst_supplier_name : it.mst_customer_name,
    },
    {
      title: "",
      key: "pos_trx_inbound_id",
      action: ["read"],
    },
  ];
};
