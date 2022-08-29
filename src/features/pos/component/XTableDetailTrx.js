import { Card, Table } from "antd";
import { XTableV2 } from "component";
import { toDate } from "helper/utils";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

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
    // console.log("data,", data);
  }, [data]);

  const scheme = () => {
    return [
      {
        title: "Barcode",
        key: "barcode",
      },
      {
        title: "Product",
        key: "mst_item_name",
      },
      {
        title: "Mfg Date",
        key: "mfg_date",
        cell: (it) => toDate(it.mfg_date),
      },
      {
        title: "Exp Date",
        key: "exp_date",
        cell: (it) => toDate(it.exp_date),
      },
      {
        title: "Quantity",
        key: "qty",
      },
      {
        title: "Quantity Stock",
        key: "qty_stock",
      },
    ];
  };

  return (
    <XTableV2
      columns={scheme()}
      items={[...data]}
      pagination={false}
      searchable={false}
    />
  );
};

export default XFormReadTrx;
