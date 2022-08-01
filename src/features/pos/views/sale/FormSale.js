import {
  DeleteOutlined,
  DownSquareOutlined,
  LoginOutlined,
  LogoutOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  InputNumber,
  Popover,
  Row,
  Space,
  Table,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getRoute } from "../../../../helper/utils";
import moment from "moment";
import Countdown from "antd/lib/statistic/Countdown";
import { getCashier, insertCashier, updateCashier } from "../../resource";
import { XModalOpenCashier } from "../../component";
import { toast } from "react-toastify";
import XSelectSearch from "../../../../component/XSelectSearch";
import { getCustomer, getProductVariant } from "../../../../resource";

const itemDef = () => {
  return JSON.parse(
    JSON.stringify({
      mst_item_variant_id: "",
      qty: "",
      barcode: "",
    })
  );
};
const FormSale = () => {
  const route = getRoute();
  const profile = JSON.parse(localStorage.getItem("profile"));
  let itemRef = useRef([]);
  const [expandCashier, setExpandCashier] = useState(false);
  const [visibleOpenCashier, setVisibleOpenCashier] = useState(false);
  const [cashierData, setCashierData] = useState({});
  const [listCustomer, setListCustomer] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [formData, setFormData] = useState({ sale_item: [{ ...itemDef() }] });

  useEffect(() => {
    loadCashier();
  }, []);

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

  const loadCustomer = async (e) => {
    let filter = { page: 1, limit: 10, search: e };
    let _cust = await getCustomer(filter);
    if (_cust.total > 1) {
      setListCustomer([..._cust.data]);
    }
  };

  const loadItem = async (text, type) => {
    let filter = { page: 1, limit: 10 };
    if (type == "barcode") {
      filter.barcode = text;
    } else {
      filter.search = text;
    }
    let _data = await getProductVariant(filter);
    if (_data) {
      setListItem([..._data.data]);
    } else {
      setListItem([]);
    }
    return _data;
  };

  const handleDeleteRow = (index) => {
    let _item = formData.item;
    _item.splice(index, 1);
    setFormData({ ...formData, item: [..._item] });
  };

  const handleChangeBarcode = async (val, index) => {
    let _data = await loadItem(val, "barcode");
    console.log(_data);
    if (_data.data.length == 1) {
      let id = _data.data[0].mst_item_variant_id;
      changeItem(id, "mst_item_variant_id", index);
    }
  };

  const changeItem = (val, key, index) => {
    let _item = formData.sale_item;
    _item[index][key] = val;
    if (val && key == "mst_item_variant_id") {
      if (!_item[index + 1]) {
        _item.push(itemDef());
        itemRef.current[index + 1]?.focus();
      }
    }
    if (val && key != "qty") {
      _item[index].qty = 1;
    }
    setFormData({ ...formData, sale_item: [..._item] });
  };

  const scheme = () => {
    return [
      {
        title: "Barcode",
        key: "mst_item_variant_id",
        render: (i, rec, index) => {
          return (
            <Input
              defaultValue={formData.sale_item[index].barcode}
              onKeyDown={(e) => {
                changeItem(e.target.value, "barcode", index);
                if (e.key === "Enter") {
                  handleChangeBarcode(e.target.value, index);
                  e.preventDefault();
                }
              }}
              status={
                !formData.sale_item[index].mst_item_variant_id ? "error" : null
              }
              ref={(el) => itemRef.current.push(el)}
              autoFocus
            />
          );
        },
      },
      {
        title: "Product",
        key: "mst_item_variant_id",
        render: (i, rec, index) => {
          return (
            <XSelectSearch
              allowClear
              placeholder="input search text"
              name="mst_item_variant_id"
              onSearch={(e) => loadItem(e, "search")}
              option={listItem.map((it) => {
                return {
                  text: `${it.mst_item_name} (${it.mst_packaging_code}) @${it.mst_item_variant_qty}`,
                  value: it.mst_item_variant_id,
                };
              })}
              //       // onChange={(val) => handleChangeRowProduct(val, index)}
              initialValue={formData.sale_item[index].mst_item_variant_id}
            />
          );
        },
      },
      {
        title: "Quantity",
        key: "qty",
        render: (i, rec, index) => (
          <InputNumber
            defaultValue={1}
            onChange={(e) => changeItem(e, "qty", index)}
          />
        ),
      },
      {
        title: "",
        key: "null",
        render: (i, rec, index) => (
          <>
            {!index ? null : (
              <DeleteOutlined onClick={() => handleDeleteRow(index)} />
            )}
          </>
        ),
      },
    ];
  };
  return (
    <>
      <XModalOpenCashier
        visible={visibleOpenCashier}
        onSubmit={(item) => handleSubmitCashier(item)}
        onCancel={() => setVisibleOpenCashier(false)}
        initialValue={cashierData}
      />
      <Card
        title={route.name}
        style={{ textTransform: "capitalize" }}
        extra={
          <Space>
            {Object.keys(cashierData).length == 0 ? (
              <Popover content={"Open Cashier"}>
                <Button onClick={() => setVisibleOpenCashier(true)}>
                  <LoginOutlined />
                </Button>
              </Popover>
            ) : (
              <Popover content={"Close Cashier"}>
                <Button onClick={() => setVisibleOpenCashier(true)}>
                  <LogoutOutlined />
                </Button>
              </Popover>
            )}
            {expandCashier ? (
              <DownSquareOutlined
                onClick={() => setExpandCashier(!expandCashier)}
              />
            ) : (
              <RightSquareOutlined
                onClick={() => setExpandCashier(!expandCashier)}
              />
            )}
          </Space>
        }
      >
        {expandCashier ? (
          <Divider orientation="right" orientationMargin={50}>
            <Countdown
              title="Count Down Working Time"
              value={moment(cashierData.created_at).add(8, "hours").valueOf()}
            />
          </Divider>
        ) : null}

        {/* Start San Product */}
        {Object.keys(cashierData).length == 0 ? null : (
          <>
            <Row style={{ marginBlock: 10, marginInline: 15 }}>
              <Col span={10}>Customer</Col>
              <Col span={10}>
                <XSelectSearch
                  allowClear
                  placeholder="Customer Default"
                  name="mst_customer_id"
                  initialValue={formData.mst_customer_id}
                  onSearch={(e) => loadCustomer(e, "search")}
                  option={listCustomer.map((it) => {
                    return {
                      text: `${it.mst_customer_name}`,
                      value: it.mst_customer_id,
                    };
                  })}
                  onChange={(val) =>
                    setFormData({ ...formData, mst_customer_id: val })
                  }
                />
              </Col>
            </Row>

            <Table
              columns={scheme()}
              dataSource={[...formData.sale_item]}
              pagination={false}
            />
          </>
        )}
      </Card>
    </>
  );
};
export default FormSale;
