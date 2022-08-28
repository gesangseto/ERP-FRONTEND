import { Card, Tag } from "antd";
import { XTable } from "component";
import { defaultFilter } from "constants";
import { getReceiveByUser, getReportSaleByBranch } from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute, numberWithComma } from "helper/utils";
import moment from "moment";

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
        rowKey="pos_cashier_id"
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
      render: (i, rec) => <p>{moment(i).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: "Close Cashier",
      key: "updated_at",
      render: (i, rec) => {
        let dt = moment(i).format("YYYY-MM-DD HH:mm:ss");
        return <p>{dt === "Invalid date" ? "-" : dt}</p>;
      },
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
      render: (i, rec) => {
        let color = "red";
        let title = "Open";
        if (!rec.is_cashier_open) {
          color = "green";
          title = "Close";
        }
        return (
          <Tag color={color} key={i}>
            {title}
          </Tag>
        );
      },
    },
    {
      title: "Cash Collect",
      key: "grand_total",
      render: (i, rec) => {
        return <>Rp. {numberWithComma(i || 0)}</>;
      },
    },
    {
      title: "Sell Item",
      key: "total_qty",
      render: (i, rec) => {
        return <>{numberWithComma(i || 0)}</>;
      },
    },
    {
      title: "",
      key: "pos_cashier_id",
      action: ["read"],
    },
  ];
};
