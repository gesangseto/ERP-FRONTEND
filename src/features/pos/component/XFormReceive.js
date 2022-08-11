import { DeleteOutlined } from "@ant-design/icons";
import { Card, DatePicker, Input, InputNumber, Table } from "antd";
import XSelectSearch from "component/XSelectSearch";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { getProductVariant } from "resource";

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
      // {
      //   title: "Batch No",
      //   key: "batch_no",
      //   render: (i, rec, index) => (
      //     <Input
      //       defaultValue={rec.batch_no}
      //       onChange={(e) => changeItem(e.target.value, "batch_no", index)}
      //     />
      //   ),
      // },
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
    <Card style={{ marginBlock: 40 }}>
      <Table
        columns={scheme()}
        dataSource={[...formData.item]}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default XFormReceive;
