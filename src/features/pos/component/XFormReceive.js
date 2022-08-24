import { DeleteOutlined } from "@ant-design/icons";
import { Card, DatePicker, Input, InputNumber, Table } from "antd";
import XSelectSearch from "component/XSelectSearch";
import { makeId, sumByKey } from "helper/utils";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { getProductVariant } from "resource";

const itemDef = () => {
  return JSON.parse(
    JSON.stringify({
      key: makeId(5),
      batch_no: "",
      mst_item_variant_id: "",
      mfg_date: moment(),
      exp_date: moment().add(3, "years"),
      qty: "",
      barcode: "",
    })
  );
};

const XFormReceive = (props) => {
  const { onChange, hiddenBatch } = props;
  const [formData, setFormData] = useState({ item: [{ ...itemDef() }] });
  const [listItem, setListItem] = useState([]);
  let itemRef = useRef([]);

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

  const handleChangeBarcode = async (val, index) => {
    let _data = await loadItem(val, "barcode");
    if (_data.data.length == 1) {
      changeItemV2(_data.data[0], index);
    }
  };

  const changeItemV2 = (item, index) => {
    item = { ...itemDef(), ...item };
    item.key = makeId(5);
    console.log(index, item);
    let _item = formData.item;
    console.log(_item);
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
    setFormData({ ...formData, item: [..._item] });
  };

  const handleDeleteRow = (index) => {
    let _item = formData.item;
    _item.splice(index, 1);
    setFormData({ ...formData, item: [..._item] });
  };
  useEffect(() => {
    if (onChange) {
      onChange(formData.item);
    }
  }, [formData]);

  const scheme = () => {
    return [
      {
        title: "Barcode",
        key: "mst_item_variant_id",
        render: (i, rec, index) => {
          return (
            <Input
              ref={(el) => itemRef.current.push(el)}
              defaultValue={formData.item[index].barcode}
              onChange={(e) => {}}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangeBarcode(e.target.value, index);
                  e.preventDefault();
                }
              }}
              status={
                !formData.item[index].mst_item_variant_id ? "error" : null
              }
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
            />
          );
        },
      },
      {
        title: "Mfg Date",
        key: "mfg_date",
        render: (i, rec, index) => (
          <DatePicker
            defaultValue={moment(rec.mfg_date)}
            onChange={(e) => {
              let _item = formData.item;
              _item[index].mfg_date = moment(e).format("YYYY-MM-DD");
              setFormData({ ...formData, item: _item });
            }}
          />
        ),
      },
      {
        title: "Exp Date",
        key: "exp_date",
        render: (i, rec, index) => (
          <DatePicker
            onChange={(e) => {
              let _item = formData.item;
              _item[index].exp_date = moment(e).format("YYYY-MM-DD");
              setFormData({ ...formData, item: _item });
            }}
            defaultValue={moment(rec.exp_date)}
          />
        ),
      },
      {
        title: "Quantity",
        key: "qty",
        render: (i, rec, index) => (
          <InputNumber
            value={rec.qty}
            onChange={(e) => {
              let _item = formData.item;
              _item[index].qty = e;
              setFormData({ ...formData, item: _item });
            }}
            min={0}
            defaultValue={rec.qty}
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
    <Card style={{ marginBlock: 40 }}>
      <Table
        rowKey={"key"}
        columns={scheme()}
        dataSource={[...formData.item]}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default XFormReceive;
