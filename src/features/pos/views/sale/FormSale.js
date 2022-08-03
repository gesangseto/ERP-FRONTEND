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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  getStock,
  insertCashier,
  insertSale,
  paymentSale,
  updateCashier,
} from "../../resource";

const itemDef = () => {
  return JSON.parse(
    JSON.stringify({
      key: makeId(5),
      mst_item_variant_id: "",
      qty: 1,
      barcode: "",
      pos_discount: 0,
      mst_item_variant_price: 0,
    })
  );
};

const FormSale = () => {
  const route = getRoute();
  const navigate = useNavigate();
  let { type, id } = useParams();
  const profile = JSON.parse(localStorage.getItem("profile"));
  let inputCust = useRef(null);
  let inputCash = useRef(null);
  let itemRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandCashier, setExpandCashier] = useState(false);
  const [customer, setCustomer] = useState({});
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

  const handleUserKeyPress = (e) => {
    const { key, keyCode } = e;
    if (key === "F12") {
      if (formData.pos_trx_sale_id) showModalPayment();
    } else if (key === "F11") {
      handleClickCheckout();
    } else if (key === "F10") {
      inputCust.current?.focus();
    } else if (key === "F1") {
      let item = formData.sale_item;
      for (var i = 0; i < item.length; i++) {
        if (!item[i].mst_item_variant_id) {
          itemRef.current[i]?.focus();
          break;
        }
      }
    }
    if (keyCode >= 112 && keyCode <= 123) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [formData]);

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
      console.log(_data);
      setFormData({
        ..._data,
        sale_item: remapingDetail(_data.detail),
      });
    }
  };

  const loadCustomer = async (e) => {
    let filter = { page: 1, limit: 10, search: e };
    let _cust = await getCustomer(filter);
    if (_cust.total > 1) {
      setListCustomer([..._cust.data]);
    } else {
      setListCustomer([]);
    }
  };

  const loadDefaultCust = async () => {
    if (id) return;
    console.log("LOAD DEFAULT CUST");
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
    let filter = { page: 1, limit: 10, status: 1 };
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

  const sendPayment = async (item) => {
    console.log(item);
    let _data = await paymentSale(item);
    if (_data) {
      toast.success("Success");
      navigate(-1);
    }
  };

  const showModalPayment = () => {
    setVisiblePayment(true);
    inputCash.current?.focus();
  };

  const handleDeleteRow = (index) => {
    let _item = formData.sale_item;
    _item.splice(index, 1);
    setFormData({ ...formData, sale_item: [..._item] });
  };

  const handleClickCheckout = async () => {
    if (formData.pos_trx_sale_id) {
      return;
    }
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleChangeBarcode = async (val, index) => {
    let _data = await loadItem(val, "barcode");
    if (_data.data.length == 1) {
      changeItemV2(_data.data[0], index);
    }
  };

  const changeItem = (val, key, index) => {
    let _item = formData.sale_item;
    _item[index][key] = val;
    setFormData({ ...formData, sale_item: [..._item] });
  };

  const changeItemV2 = (item, index) => {
    let _item = formData.sale_item;
    if (Object.keys(item) == 0) {
      _item[index] = itemDef();
    } else {
      _item[index] = { ...item, qty: 1 };
    }
    if (!_item[index + 1]) {
      _item.push(itemDef());
      itemRef.current[index + 1]?.focus();
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
              ref={(el) => itemRef.current.push(el)}
              autoFocus
              defaultValue={formData.sale_item[index].barcode}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangeBarcode(e.target.value, index);
                  e.preventDefault();
                }
              }}
              status={
                !formData.sale_item[index].mst_item_variant_id ? "error" : null
              }
              readOnly={formData.pos_trx_sale_id}
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
              style={{
                maxWidth: 600,
                width: 300,
              }}
              allowClear
              placeholder="input search text"
              name="mst_item_variant_id"
              onSearch={(e) => loadItem(e, "search")}
              option={listItem.map((it) => {
                return {
                  text: `${it.mst_item_name} (${it.mst_packaging_code}) @${it.mst_item_variant_qty}`,
                  value: it.mst_item_variant_id + "",
                  ...it,
                };
              })}
              onChange={(val, item) => {
                changeItemV2(
                  item.hasOwnProperty("item") ? item.item : {},
                  index
                );
              }}
              initialValue={rec.mst_item_variant_id + ""}
              disabled={formData.pos_trx_sale_id}
            />
          );
        },
      },
      {
        title: "Price",
        key: "price",
        render: (i, rec, index) => {
          let price = numberPercent(
            rec.mst_item_variant_price,
            customer.price_percentage
          );
          return (
            <>
              Rp.
              {numberWithComma(price)}
            </>
          );
        },
      },
      {
        title: "Discount",
        key: "pos_discount",
        render: (i, rec, index) => {
          return <>{rec.pos_discount} %</>;
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
          let total =
            numberPercent(
              rec.mst_item_variant_price,
              customer.price_percentage
            ) * rec.qty;
          return <>Rp. {numberWithComma(total)}</>;
        },
      },
      {
        title: "",
        key: "null",
        render: (i, rec, index) => (
          <>
            {!index || formData.pos_trx_sale_id ? null : (
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
            <Row style={{}}>
              <Col span={16}>
                <Table
                  rowKey={"key"}
                  columns={scheme()}
                  dataSource={[...formData.sale_item]}
                  pagination={false}
                  size="small"
                />
              </Col>
              <Col span={8}>
                <Card>
                  <Descriptions
                    column={1}
                    title="Customer [F10]"
                    size={1}
                    extra={
                      <XSelectSearch
                        ref={inputCust}
                        onFocus={(e) => e.persist()}
                        // autoFocus
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

                  <Divider orientation="center">
                    <>
                      {formData.pos_trx_sale_id ? (
                        <Button
                          type="success"
                          onClick={() => showModalPayment()}
                        >
                          Payment [F12]
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => handleClickCheckout()}
                          addonbefore={"F12"}
                          loading={isLoading}
                        >
                          Checkout [F11]
                        </Button>
                      )}
                    </>
                  </Divider>

                  <Descriptions column={1} title="Total" size={1}>
                    <Descriptions.Item label="PPN">
                      {customer.mst_customer_ppn ?? customer.ppn ?? 0} %
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Price">
                      Rp.{" "}
                      {numberWithComma(
                        formData.total_price ??
                          numberPercent(
                            sumItem(
                              formData.sale_item,
                              "mst_item_variant_price"
                            ),
                            customer.price_percentage
                          )
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Grand Total">
                      RP.{" "}
                      {numberWithComma(
                        formData.grand_total ??
                          numberPercent(
                            numberPercent(
                              sumItem(
                                formData.sale_item,
                                "mst_item_variant_price"
                              ),
                              customer.price_percentage
                            ),
                            customer.mst_customer_ppn
                          )
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
        onClickPaid={(item) => sendPayment(item)}
        data={formData}
        ref={inputCash}
      />
    </>
  );
};
export default FormSale;
