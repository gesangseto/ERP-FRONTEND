import { Card, Table, Tag } from "antd";
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
        title: "Username",
        key: "user_name",
        render: (i, rec) => <p>{`${rec.user_name}`}</p>,
      },
      {
        title: "Email",
        key: "user_email",
        render: (i, rec) => <p>{`${rec.user_name}`}</p>,
      },
      {
        title: "Is Cashier",
        key: "is_cashier",
        render: (i, rec) => {
          let color = rec.is_cashier ? "green" : "red";
          return (
            <Tag color={color} key={i}>
              {rec.is_cashier ? "Yes" : "No"}
            </Tag>
          );
        },
      },
    ];
  };

  return (
    <Card style={{ margin: 40 }}>
      <Table
        rowKey={"user_id"}
        columns={scheme()}
        dataSource={[...data]}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default XFormReadTrx;
