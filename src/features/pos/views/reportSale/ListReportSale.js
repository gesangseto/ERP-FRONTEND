import { Card, Tag } from "antd";
import { XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getReportSaleByBranch } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute, numberWithComma, toDate } from "helper/utils";

const ListReportSale = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getReportSaleByBranch(filter);
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
    <Card title={route.name} style={{ textTransform: "capitalize" }}>
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

export default ListReportSale;

const columns = () => {
  return [
    {
      title: "Branch",
      key: "pos_branch_code",
    },
    {
      title: "Open Cashier",
      key: "created_at",
      cell: (it) => toDate(it.created_at),
    },
    {
      title: "Close Cashier",
      key: "updated_at",
      cell: (it) => toDate(it.updated_at),
    },
    {
      title: "Cashier",
      key: "user_name",
    },
    {
      title: "Shift",
      key: "pos_cashier_shift",
    },
    {
      title: "Cashier Num",
      key: "pos_cashier_number",
    },
    {
      title: "Is Open",
      key: "is_cashier_open",
      cell: (rec) => {
        let color = "red";
        let title = "Open";
        if (!rec.is_cashier_open) {
          color = "green";
          title = "Close";
        }
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "Cash Collect (Rp)",
      key: "grand_total",
      cell: (it) => numberWithComma(it.grand_total),
    },
    {
      title: "Sell Item",
      key: "total_qty",
    },
    {
      title: "",
      key: "pos_cashier_id",
      action: ["read"],
    },
  ];
};
