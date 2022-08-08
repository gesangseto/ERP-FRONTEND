import { DeleteOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, InputNumber, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import XSelectSearch from "../../../component/XSelectSearch";
import { getProductVariant } from "../../../resource";

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

const XFormReadTrx = (props) => {
  const { data } = props;
  const [formData, setFormData] = useState({ item: [{ ...itemDef() }] });
  const [listItem, setListItem] = useState([]);
  let itemRef = useRef([]);

  useEffect(() => {
    console.log("data,", data);
  }, [data]);

  const scheme = () => {
    return [
      // {
      //   title: "Barcode",
      //   key: "mst_item_variant_id",
      //   render: (i, rec, ) => <p>{rec.barcode}</p>,
      // },
      {
        title: "Barcode",
        key: "barcode",
        render: (i, rec) => <p>{`${rec.barcode}`}</p>,
      },
      {
        title: "Product",
        key: "mst_item_id",
        render: (i, rec) => <p>{`${rec.mst_item_name}`}</p>,
      },
      // {
      //   title: "Batch No",
      //   key: "mst_item_id",
      //   render: (i, rec) => {
      //     let color = rec.status ? "green" : "red";
      //     return (
      //       <Tag color={color} key={i}>
      //         {rec.batch_no}
      //       </Tag>
      //     );
      //   },
      // },
      {
        title: "Mfg Date",
        key: "mfg_date",
        render: (i, rec) => <p>{moment(rec.mfg_date).format("YYYY-MM-DD")}</p>,
      },
      {
        title: "Exp Date",
        key: "exp_date",
        render: (i, rec) => <p>{moment(rec.exp_date).format("YYYY-MM-DD")}</p>,
      },
      {
        title: "Quantity",
        key: "qty",
        render: (i, rec) => <p>{rec.qty}</p>,
      },
      {
        title: "Quantity Stock",
        key: "qty_stock",
        render: (i, rec) => <p>{rec.qty_stock}</p>,
      },
    ];
  };

  return (
    <Card style={{ margin: 40 }}>
      <Table
        columns={scheme()}
        dataSource={[...data]}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default XFormReadTrx;
