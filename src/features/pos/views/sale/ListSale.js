import { Button, Card, Popover, Space, Tag } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import {
  getCashier,
  getSaleByUser,
  insertCashier,
  updateCashier,
} from "features/pos/resource";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { XModalOpenCashier } from "features/pos/component";
import { getRoute, numberWithComma, toDate } from "helper/utils";
import { toast } from "react-toastify";

const ListSale = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [cashierData, setCashierData] = useState({});
  const [visibleOpenCashier, setVisibleOpenCashier] = useState(false);
  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    loadData();
  }, [filter]);

  useEffect(() => {
    if (Object.keys(cashierData).length == 0) loadCashier();
  }, []);

  const loadData = async () => {
    let _data = await getSaleByUser(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const loadCashier = async () => {
    let _data = await getCashier({
      created_by: profile.user_id,
      is_cashier_open: true,
    });
    if (_data) {
      if (_data.total == 0) {
        setCashierData({});
      } else {
        setCashierData({ ..._data.data[0] });
      }
    }
  };

  const handleSubmitCashier = async (item) => {
    let _data;
    if (item.pos_cashier_id) {
      _data = await updateCashier(item);
      if (_data) {
        toast.success("Sucess close cashier");
      }
    } else {
      _data = await insertCashier(item);
      if (_data) {
        toast.success("Sucess open cashier");
      }
    }
    setVisibleOpenCashier(false);
    loadCashier();
  };

  const handleClickAction = async (action, id) => {
    navigate(`${route.path}/${action}/${id}`);
  };
  const handleClickAdd = () => {
    navigate(`${route.path}/create`);
  };

  const columns = () => {
    return [
      {
        title: "Branch",
        key: "pos_branch_code",
      },
      {
        title: "INVOICE",
        key: "pos_trx_sale_id",
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
        title: "Customer",
        key: "mst_customer_name",
      },
      {
        title: "Phone",
        key: "mst_customer_phone",
      },
      {
        title: "Total Price",
        key: "total_price",
        cell: (it) => numberWithComma(it.total_price),
      },
      {
        title: "PPN (%)",
        key: "ppn",
        cell: (it) => it.ppn ?? 0,
      },
      {
        title: "Discount (%)",
        key: "total_discount",
        cell: (it) => it.total_discount ?? 0,
      },
      {
        title: "Grand Total",
        key: "grand_total",
        cell: (it) => numberWithComma(it.grand_total),
      },
      {
        title: "Status",
        key: "status",
      },
      {
        title: "Pay Status",
        key: "is_paid",
        cell: (it) => (
          <Tag color={it.is_paid ? "green" : "red"}>
            {it.is_paid ? "Paid" : "Not Paid"}
          </Tag>
        ),
      },
      {
        title: "",
        key: "pos_trx_sale_id",
        cell: (it, index) => {
          return (
            <>
              {!it.is_paid ? (
                <XButton
                  popover={"update"}
                  type={"update"}
                  record={it}
                  onClick={() =>
                    handleClickAction("update", it.pos_trx_sale_id)
                  }
                  style={{ float: "right", marginInline: 2 }}
                />
              ) : null}
              <XButton
                popover={"read"}
                type={"read"}
                record={it}
                onClick={() => handleClickAction("read", it.pos_trx_sale_id)}
                style={{ float: "right", marginInline: 2 }}
              />
            </>
          );
        },
      },
    ];
  };

  return (
    <Card
      title={route.name}
      style={{ textTransform: "capitalize" }}
      extra={
        <>
          {Object.keys(cashierData).length == 0 ? (
            <Popover content={"Open Cashier"}>
              <Button onClick={() => setVisibleOpenCashier(true)}>
                <LoginOutlined />
              </Button>
            </Popover>
          ) : (
            <Space>
              <Popover content={"Close Cashier"}>
                <Button onClick={() => setVisibleOpenCashier(true)}>
                  <LogoutOutlined style={{ color: "red" }} />
                </Button>
              </Popover>
              <XButton
                popover="Create"
                type="create"
                onClick={() => handleClickAdd()}
              />
            </Space>
          )}
        </>
      }
    >
      <XModalOpenCashier
        visible={visibleOpenCashier}
        onSubmit={(item) => handleSubmitCashier(item)}
        onCancel={() => setVisibleOpenCashier(false)}
        initialValue={cashierData}
      />
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

export default ListSale;
