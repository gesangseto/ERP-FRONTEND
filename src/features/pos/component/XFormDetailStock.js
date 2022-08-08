import { Card, Table } from "antd";
import { numberWithComma } from "helper/utils";
import { useEffect } from "react";

const XFormDetailStock = (props) => {
  const { data } = props;

  useEffect(() => {
    console.log("data,", data);
  }, [data]);

  const scheme = () => {
    return [
      {
        title: "Barcode",
        key: "mst_item_variant_id",
        render: (i, rec) => <p>{rec.barcode}</p>,
      },
      {
        title: "Variant",
        key: "mst_item_variant_name",
        render: (i, rec) => <p>{rec.mst_item_variant_name}</p>,
      },
      {
        title: "Pack",
        key: "mst_packaging_code",
        render: (i, rec) => <p>{rec.mst_packaging_code}</p>,
      },
      {
        title: "Qty Child",
        key: "mst_item_variant_qty",
        render: (i, rec) => <p>{rec.mst_item_variant_qty}</p>,
      },
      {
        title: "Price",
        key: "mst_item_variant_price",
        render: (i, rec) => (
          <p>Rp. {numberWithComma(rec.mst_item_variant_price)}</p>
        ),
      },
    ];
  };

  return (
    <Card style={{ margin: 40 }}>
      <Table columns={scheme()} dataSource={[...data]} pagination={false} />
    </Card>
  );
};

export default XFormDetailStock;
