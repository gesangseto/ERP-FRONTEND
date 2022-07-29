import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval, XSelect, XTextArea } from "../../../../component";
import { makeOption, removeEmptyObject } from "../../../../helper/utils";

import XSelectSearch from "../../../../component/XSelectSearch";
import { getProductVariant, getSupplier } from "../../../../resource";
import routes from "../../../../routes";
import { getReceive, insertReceive, updateReceive } from "../../resource";
import { DeleteColumnOutlined, DeleteOutlined } from "@ant-design/icons";

const itemDef = () => {
  return JSON.parse(
    JSON.stringify({
      batch_no: "",
      mst_item_variant_id: "",
      mfg_date: moment(),
      exp_date: moment().add(3, "years"),
      qty: "",
      barcode: "",
    })
  );
};

const FormReceive = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ item: [{ ...itemDef() }] });
  const [listSupplier, setListSupplier] = useState([]);
  const [listItem, setListItem] = useState([]);
  let itemRef = useRef([]);

  useEffect(() => {
    (async function () {
      loadSupplier();
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.pos_receive_id]);

  const loadSupplier = async () => {
    let _data = await getSupplier();
    _data = _data.data;
    _data = makeOption(_data, "mst_supplier_id", "mst_supplier_name");
    setListSupplier([..._data]);
  };

  const loadItem = async (text, type) => {
    let filter = { page: 1, limit: 5 };
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

  const loadFormData = async (id) => {
    let _data = await getReceive({ pos_receive_id: id });
    _data = _data.data[0];
    setFormData({ ..._data, item: _data.detail });
  };

  const saveFormData = async (param = Object) => {
    let _body = { ...formData, ...param };
    let _item = [];
    for (const it of _body.item) {
      if (it.mst_item_variant_id) {
        _item.push(it);
      }
    }
    _body.item = _item;
    let _data;
    if (id) {
      param.mst_customer_id = id;
      _data = await updateReceive(_body);
    } else {
      _data = await insertReceive(_body);
    }
    if (_data) {
      toast.success("Success");
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.status = e.status ? 1 : 0;
    saveFormData(e);
  };
  const handleChangeRowProduct = (val, index) => {
    let _item = formData.item;
    _item[index].mst_item_variant_id = val;
    changeItem(val, "mst_item_variant_id", index);
  };
  const handleChangeBarcode = async (val, index) => {
    let _data = await loadItem(val, "barcode");
    if (_data.data.length == 1) {
      let id = _data.data[0].mst_item_variant_id;
      changeItem(id, "mst_item_variant_id", index);
    }
  };

  const changeItem = (val, key, index) => {
    let _item = formData.item;
    _item[index][key] = val;
    if (val && key == "mst_item_variant_id") {
      if (!_item[index + 1]) {
        _item.push(itemDef());
        itemRef.current[index + 1]?.focus();
      }
    }
    setFormData({ ...formData, item: [..._item] });
  };

  const handleDeleteRow = (index) => {
    let _item = formData.item;
    _item.splice(index, 1);
    setFormData({ ...formData, item: [..._item] });
  };

  const scheme = () => {
    return [
      {
        title: "Barcode",
        key: "mst_item_variant_id",
        render: (i, rec, index) => {
          return (
            <Input
              defaultValue={formData.item[index].barcode}
              onChange={(e) => {}}
              onKeyDown={(e) => {
                changeItem(e.target.value, "barcode", index);
                if (e.key === "Enter") {
                  handleChangeBarcode(e.target.value, index);
                  e.preventDefault();
                }
              }}
              status={
                !formData.item[index].mst_item_variant_id ? "error" : null
              }
              ref={(el) => itemRef.current.push(el)}
              autoFocus
            />
          );
        },
      },
      {
        title: "Product",
        key: "mst_item_id",
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
              onChange={(val) => handleChangeRowProduct(val, index)}
              initialValue={formData.item[index].mst_item_variant_id}
            />
          );
        },
      },
      {
        title: "Batch No",
        key: "batch_no",
        render: (i, rec, index) => (
          <Input
            defaultValue={rec.batch_no}
            onChange={(e) => changeItem(e.target.value, "batch_no", index)}
          />
        ),
      },
      {
        title: "Mfg Date",
        key: "mfg_date",
        render: (i, rec, index) => (
          <DatePicker
            defaultValue={moment(rec.mfg_date)}
            onChange={(e) =>
              changeItem(moment(e).format("YYYY-MM-DD"), "mfg_date", index)
            }
          />
        ),
      },
      {
        title: "Exp Date",
        key: "exp_date",
        render: (i, rec, index) => (
          <DatePicker
            defaultValue={moment(rec.exp_date)}
            onChange={(e) =>
              changeItem(moment(e).format("YYYY-MM-DD"), "exp_date", index)
            }
          />
        ),
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
    <Card title={route.name} style={{ textTransform: "capitalize" }}>
      <Form
        ref={form}
        defaultValue={formData}
        onFinish={(e) => handleSubmit(e)}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: "default",
        }}
        size={"default"}
      >
        <XSelect
          title="Supplier"
          name={"mst_supplier_id"}
          initialValue={formData.mst_supplier_id}
          disabled={type != "create"}
          required
          option={listSupplier}
        />
        <Card>
          <Table columns={scheme()} dataSource={[...formData.item]} />
        </Card>
        {type != "create" ? (
          <XTextArea
            title="Note"
            name={"pos_receive_note"}
            initialValue={formData.pos_receive_note}
            disabled={formData.status != 0}
          />
        ) : null}

        <Form.Item>
          {type == "create" ? (
            <Button
              loading={loading}
              type="success"
              htmlType="submit"
              disabled={type == "read"}
            >
              Save
            </Button>
          ) : null}
          {formData.status == 0 ? (
            <>
              <Button
                loading={loading}
                type="success"
                htmlType="submit"
                disabled={type == "read"}
                onClick={() => setFormData({ ...formData, is_approve: "true" })}
              >
                Proccess
              </Button>
              &nbsp;
              <Button
                loading={loading}
                type="danger"
                htmlType="submit"
                disabled={type == "read"}
                onClick={() =>
                  setFormData({ ...formData, is_approve: "false" })
                }
              >
                Reject
              </Button>
            </>
          ) : null}
          &nbsp;
          <Button type="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
      <XFormApproval item={formData} />
    </Card>
  );
};
export default FormReceive;
