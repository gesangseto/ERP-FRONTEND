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
  Descriptions,
  Divider,
  Input,
  InputNumber,
  Popover,
  Row,
  Space,
  Table,
} from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import XSelectSearch from "../../../../component/XSelectSearch";
import {
  getRoute,
  makeId,
  numberPercent,
  numberWithComma,
  removeEmptyObject,
} from "../../../../helper/utils";
import {
  getConfigRelation,
  getCustomer,
  getProductVariant,
} from "../../../../resource";
import { XDrawerPayment, XModalOpenCashier } from "../../component";
import {
  getCashier,
  getSale,
  insertCashier,
  insertSale,
  updateCashier,
  updateSale,
} from "../../resource";

const itemDef = () => {
  return JSON.parse(
    JSON.stringify({
      key: makeId(5),
      mst_item_variant_id: "",
      qty: 1,
      barcode: "",
      discount: 0,
      mst_item_variant_price: 0,
    })
  );
};

const FormSale = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const profile = JSON.parse(localStorage.getItem("profile"));
  const [customer, setCustomer] = useState({});
  let itemRef = useRef([]);
  const [expandCashier, setExpandCashier] = useState(false);
  const [visibleOpenCashier, setVisibleOpenCashier] = useState(false);
  const [cashierData, setCashierData] = useState({});
  const [listCustomer, setListCustomer] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [formData, setFormData] = useState({ sale_item: [{ ...itemDef() }] });
  const [visiblePayment, setVisiblePayment] = useState(false);

  const sumItem = (arr = Array, key) => {
    let sum = 0;
    for (const it of arr) {
      if (it[key]) {
        sum += it[key];
      }
    }
    return sum;
  };

  const disableForm = () => {
    setFormData({ sale_item: [] });
  };

  const handleUserKeyPress = useCallback((event) => {
    const { key, keyCode } = event;
    if (key === "F12") {
      handleClickCheckout();
    }
    console.log(keyCode, key);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  useEffect(() => {
    if (Object.keys(cashierData).length == 0) loadCashier();
    if (Object.keys(customer).length == 0) loadDefaultCust();
    if (id) loadData(id);
  }, []);

  useEffect(() => {
    if (formData.pos_trx_sale_id) {
      setListCustomer([{ ...formData }]);
      setCustomer({ ...formData });
      setListItem([...formData.detail]);
    }
  }, [formData]);

  const remapingDetail = (array) => {
    let _data = [];
    for (let it of array) {
      it.key = makeId(5);
      _data.push(it);
    }
    return _data;
  };

  const loadData = async (id) => {
    console.log("GET DATA");
    let _data = await getSale({ pos_trx_sale_id: id });
    if (_data) {
      _data = _data.data[0];
      setFormData({
        ...formData,
        ..._data,
        sale_item: remapingDetail(_data.detail),
      });
    }
  };

  const loadCustomer = async (e = "") => {
    let filter = { page: 1, limit: 10, search: e };
    let _cust = await getCustomer(filter);
    if (_cust.total > 1) {
      setListCustomer([..._cust.data]);
    }
  };

  const loadDefaultCust = async () => {
    if (id) return;
    let _data = await getConfigRelation({
      sys_relation_code: "mst_customer_default",
    });
    if (_data) {
      _data = _data.data[0];
      if (_data.hasOwnProperty("detail")) {
        let cust = _data.detail;
        setCustomer({ ...cust });
        setFormData({
          ...formData,
          mst_customer_id: cust.mst_customer_id + "",
        });
        setListCustomer([{ ...cust }]);
        localStorage.setItem("customer_default", JSON.stringify(cust));
      } else {
        disableForm();
        return toast.error("Default customer not set, please contact Admin");
      }
    }
  };

  const loadCashier = async () => {
    console.log("GET CASHIER");
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
    let _item = formData.sale_item;
    _item.splice(index, 1);
    setFormData({ ...formData, sale_item: [..._item] });
  };

  const handleChangeBarcode = async (val, index) => {
    let _data = await loadItem(val, "barcode");
    if (_data.data.length == 1) {
      let id = _data.data[0].mst_item_variant_id;
      let price = numberPercent(
        _data.data[0].mst_item_variant_price,
        customer.price_percentage
      );
      changeItem(id, "mst_item_variant_id", index);
      changeItem(price, "mst_item_variant_price", index);
    }
  };

  const handleClickCheckout = async () => {
    if (formData.pos_trx_sale_id) {
      return;
    }
    let _body = formData;
    _body.sale_item = removeEmptyObject(
      formData.sale_item,
      "mst_item_variant_id"
    );
    let _data = await insertSale(_body);
    if (_data) {
      let id = _data.data[0].pos_trx_sale_id;
      loadData(id);
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
              // initialValue={formData.sale_item[index].mst_item_variant_id}
              initialValue={rec.mst_item_variant_id}
            />
          );
        },
      },
      {
        title: "Price",
        key: "price",
        render: (i, rec, index) => {
          return (
            <>
              Rp.
              {numberWithComma(rec.mst_item_variant_price)}
            </>
          );
        },
      },
      {
        title: "Discount",
        key: "discount",
        render: (i, rec, index) => {
          return <>{rec.discount} %</>;
        },
      },
      {
        title: "Quantity",
        key: "qty",
        render: (i, rec, index) => (
          <InputNumber
            defaultValue={rec.qty}
            onChange={(e) => changeItem(e, "qty", index)}
          />
        ),
      },
      {
        title: "Total",
        key: "total",
        render: (i, rec, index) => {
          return (
            <>Rp. {numberWithComma(rec.mst_item_variant_price * rec.qty)}</>
          );
        },
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
              <Col span={16}>
                <Card>
                  <Table
                    rowKey={"key"}
                    columns={scheme()}
                    dataSource={[...formData.sale_item]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Descriptions
                    column={1}
                    title="Customer"
                    size={1}
                    extra={
                      <XSelectSearch
                        allowClear
                        placeholder="Customer Default"
                        name="mst_customer_id"
                        initialValue={formData.mst_customer_id + ""}
                        onSearch={(e) => loadCustomer(e, "search")}
                        option={listCustomer.map((it) => {
                          return {
                            text: `${it.mst_customer_name}`,
                            value: it.mst_customer_id + "",
                            ...it,
                          };
                        })}
                        onChange={(val, item) => {
                          setCustomer({ ...item.item });
                          setFormData({ ...formData, mst_customer_id: val });
                        }}
                      />
                    }
                  >
                    <Descriptions.Item label="Name">
                      {customer.mst_customer_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {customer.mst_customer_email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      {customer.mst_customer_phone}
                    </Descriptions.Item>
                  </Descriptions>

                  <Descriptions
                    column={1}
                    title="Total"
                    size={1}
                    extra={
                      <>
                        {formData.pos_trx_sale_id ? (
                          <Button
                            type="success"
                            onClick={() => setVisiblePayment(true)}
                          >
                            Payment
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            onClick={() => handleClickCheckout()}
                          >
                            Checkout
                          </Button>
                        )}
                      </>
                    }
                  >
                    <Descriptions.Item label="PPN">
                      {customer.ppn ?? 0} %
                    </Descriptions.Item>
                    <Descriptions.Item label="Discount">
                      {formData.discount ?? 0} %
                    </Descriptions.Item>
                    <Descriptions.Item label="Qty Item">
                      {sumItem(formData.sale_item, "qty")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Price">
                      Rp.{" "}
                      {numberWithComma(
                        formData.total_price ??
                          sumItem(formData.sale_item, "mst_item_variant_price")
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Grand Total">
                      RP.{" "}
                      {numberWithComma(
                        formData.total_price ??
                          formData.grand_total ??
                          sumItem(formData.sale_item, "mst_item_variant_price")
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Card>
      <XDrawerPayment
        visible={visiblePayment}
        onClose={() => setVisiblePayment(false)}
        data={formData}
      />
    </>
  );
};
export default FormSale;
