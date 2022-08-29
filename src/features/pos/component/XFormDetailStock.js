import { Card, Table } from "antd";
import { XTableV2 } from "component";
import { numberWithComma } from "helper/utils";
import { useEffect } from "react";

const XFormDetailStock = (props) => {
  const { data } = props;

  useEffect(() => {}, [data]);

  const scheme = () => {
    return [
      {
        title: "Barcode",
        key: "barcode",
      },
      {
        title: "Variant",
        key: "mst_item_variant_name",
      },
      {
        title: "Pack",
        key: "mst_packaging_code",
      },
      {
        title: "Qty Child",
        key: "mst_item_variant_qty",
      },
      {
        title: "Price (Rp)",
        key: "mst_item_variant_price",
        cell: (rec) => numberWithComma(rec.mst_item_variant_price),
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

export default XFormDetailStock;
