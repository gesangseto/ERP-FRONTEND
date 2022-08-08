import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XButton, XTable } from "../../../../component";
import { defaultFilter } from "../../../../constants";
import { getInbound, getReceive } from "../../resource";

import moment from "moment";
import { getRoute } from "../../../../helper/utils";

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
    let _data = await getInbound(filter);
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
      <XTable
        rowKey="pos_trx_inbound_id"
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
      title: "ID",
      key: "pos_trx_inbound_id",
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
      title: "Type",
      key: "pos_trx_inbound_type",
    },
    {
      title: "Source",
      key: "pos_trx_inbound_id",
      render: (i, rec) => (
        <p>
          {rec.mst_supplier_name
            ? rec.mst_supplier_name
            : rec.mst_customer_name}
        </p>
      ),
    },
    {
      title: "",
      key: "pos_trx_inbound_id",
      action: ["read"],
    },
  ];
};
