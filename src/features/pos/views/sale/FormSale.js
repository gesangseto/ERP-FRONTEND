import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import XSelectSearch from "component/XSelectSearch";
import { XDrawerPayment, XSelectUserBranch } from "features/pos/component";
import {
  getCashier,
  getSale,
  insertSale,
  paymentSale,
  updateSale,
} from "features/pos/resource";
import {
  getRoute,
  makeId,
  numberPercent,
  numberWithComma,
  removeEmptyObject,
  sumByKey,
} from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getConfigRelation, getCustomer, getProductVariant } from "resource";

const itemDef = () => {
  return JSON.parse(
    JSON.stringify({
      key: makeId(10),
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
  const navigate = useNavigate();
  let { type, id } = useParams();
  const profile = JSON.parse(localStorage.getItem("profile"));
  let inputCust = useRef(null);
  let inputCash = useRef(null);
  let itemRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [cashierData, setCashierData] = useState({});
  const [listCustomer, setListCustomer] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [formData, setFormData] = useState({
    pos_branch_code: null,
    mst_customer_id: null,
    sale_item: [{ ...itemDef() }],
  });
  const [visiblePayment, setVisiblePayment] = useState(false);

  const disableForm = () => {
    setFormData({ sale_item: [] });
  };

  const handleUserKeyPress = (e) => {
    const { key, keyCode } = e;
    if (key === "F12") {
      if (formData.pos_trx_sale_id) showModalPayment();
    } else if (key === "F11") {
      checkout();
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
    let _data = await getSale({ pos_trx_sale_id: id });
    if (_data) {
      _data = _data.data[0];
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
    let _data = await getConfigRelation({
      sys_relation_code: "mst_customer_default",
    });
    if (_data) {
      _data = _data.data[0];
      if (_data.hasOwnProperty("detail")) {
        let cust = _data.detail;
        setCustomer({ ...cust });
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
        let data = _data.data[0];
        setCashierData({ ...data });
      }
    }
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

  const checkout = async () => {
    let pos_branch_code = cashierData.pos_branch_code;
    let mst_customer_id = customer.mst_customer_id;
    if (formData.pos_trx_sale_id) return;
    setIsLoading(true);
    let _body = {
      ...formData,
      mst_customer_id: mst_customer_id,
      pos_branch_code: pos_branch_code,
    };
    _body.sale_item = removeEmptyObject(
      formData.sale_item,
      "mst_item_variant_id"
    );
    console.log(_body);
    let _data = await insertSale(_body);
    if (_data) {
      let id = _data.data[0].pos_trx_sale_id;
      loadData(id);
    }
    setIsLoading(false);
  };

  const updateCheckout = async (rec) => {
    if (!rec) return;
    setIsLoading(true);
    let body = { ...rec, pos_trx_sale_id: formData.pos_trx_sale_id };
    let _res = await updateSale(body);
    if (_res) {
      let id = _res.data[0].pos_trx_sale_id;
      loadData(id);
    }
    setIsLoading(false);
  };

  const sendPayment = async (item) => {
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

  const handleChangeBarcode = async (val, index) => {
    let _data = await loadItem(val, "barcode");
    if (_data.data.length == 1) {
      changeItem(_data.data[0], index);
    }
  };

  const changeItem = (item, index) => {
    item.key = makeId(5);
    let _item = formData.sale_item;
    if (Object.keys(item) == 0) {
      _item[index] = itemDef();
    } else {
      _item[index] = { ...item, qty: 1 };
    }
    _item = sumByKey({ sum: "qty", key: "mst_item_variant_id", array: _item });
    if (!_item[index + 1]) {
      _item.push(itemDef());
      itemRef.current[index + 1]?.focus();
    }
    setFormData({ ...formData, sale_item: [..._item] });
  };

  const getTotal = (index) => {
    let _total = 0;
    if (index >= 0) {
      let _item = formData.sale_item[index];
      _total =
        numberPercent(_item.mst_item_variant_price, customer.price_percentage) *
        _item.qty;
    } else {
      let _items = formData.sale_item;
      for (var i = 0; i < _items.length; i++) {
        _total += getTotal(i);
      }
    }
    return _total;
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
              defaultValue={rec.barcode}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangeBarcode(e.target.value, index);
                  e.preventDefault();
                }
              }}
              status={!rec.mst_item_variant_id ? "error" : null}
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
                width: 250,
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
                changeItem(item.hasOwnProperty("item") ? item.item : {}, index);
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
          let price = rec.price;
          if (!price) {
            price = numberPercent(
              rec.mst_item_variant_price,
              customer.price_percentage
            );
          }
          return <> Rp. {numberWithComma(price)} </>;
        },
      },
      {
        title: "Promo",
        key: "discount",
        render: (i, rec, index) => {
          if (rec.discount_free_qty) {
            return (
              <>
                Buy {rec.discount_min_qty} Free {rec.discount_free_qty}{" "}
                {rec.discount_max_qty ? `(Max ${rec.discount_max_qty})` : ""}
              </>
            );
          } else {
            return (
              <>
                {rec.discount} %{" "}
                {rec.discount_max_qty ? `(Max ${rec.discount_max_qty})` : ""}
              </>
            );
          }
        },
      },
      {
        title: "Quantity",
        key: "qty",
        render: (i, rec, index) => {
          return (
            <InputNumber
              value={rec.qty}
              onChange={(e) => {
                let _item = formData.sale_item;
                _item[index].qty = e;
                setFormData({ ...formData, sale_item: _item });
              }}
              min={0}
              readOnly={formData.is_paid}
            />
          );
        },
      },
      {
        title: "Total",
        key: "total",
        render: (i, rec, index) => {
          let total = rec.total;
          if (!total) total = getTotal(index);
          return <> Rp. {numberWithComma(total)} </>;
        },
      },
      {
        title: "",
        key: "null",
        render: (i, rec, index) => (
          <>
            {index + 1 !== formData.sale_item.length &&
              !formData.pos_trx_sale_id && (
                <DeleteOutlined onClick={() => handleDeleteRow(index)} />
              )}
            {formData.pos_trx_sale_id && !formData.is_paid && (
              <Popconfirm
                title="Are you sure to change this data?"
                onConfirm={() => updateCheckout(rec)}
                okText="Yes"
                cancelText="No"
              >
                <CheckOutlined />
              </Popconfirm>
            )}
          </>
        ),
      },
    ];
  };
  return (
    <>
      <Card
        title={route.name}
        style={{ textTransform: "capitalize" }}
        extra={
          <Space>
            <XSelectUserBranch
              initialValue={cashierData.pos_branch_code}
              onChange={(val) =>
                setCashierData({ ...cashierData, pos_branch_code: val })
              }
            />
          </Space>
        }
      >
        {/* Start San Product */}
        {Object.keys(cashierData).length > 0 || type == "read" ? (
          <>
            <Row style={{}}>
              <Col span={18}>
                <Table
                  rowKey={"key"}
                  columns={scheme()}
                  dataSource={[...formData.sale_item]}
                  pagination={false}
                  size="small"
                />
              </Col>
              <Col span={6}>
                <Card>
                  <Divider orientation="center">
                    {!formData.is_paid ? (
                      <XSelectSearch
                        ref={inputCust}
                        onFocus={(e) => e.persist()}
                        // autoFocus
                        allowClear
                        placeholder="Customer Default"
                        name="mst_customer_id"
                        initialValue={customer.mst_customer_id + ""}
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
                          // setFormData({ ...formData, mst_customer_id: val });
                        }}
                      />
                    ) : (
                      formData.mst_customer_name
                    )}
                  </Divider>
                  <Descriptions column={1} title="Customer [F10]" size={1}>
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
                        !formData.is_paid ? (
                          <Button
                            type="success"
                            onClick={() => showModalPayment()}
                          >
                            Payment [F12]
                          </Button>
                        ) : (
                          "Paid"
                        )
                      ) : null}
                      {!formData.pos_trx_sale_id && (
                        <Button
                          type="primary"
                          onClick={() => checkout()}
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
                      Rp. {numberWithComma(formData.total_price ?? getTotal())}
                    </Descriptions.Item>
                    <Descriptions.Item label="Grand Total">
                      RP.{" "}
                      {numberWithComma(
                        formData.grand_total ??
                          numberPercent(getTotal(), customer.mst_customer_ppn)
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </>
        ) : null}
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
