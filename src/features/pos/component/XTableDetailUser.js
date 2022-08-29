import { Popconfirm, Space, Tag } from "antd";
import { XButton, XTableV2 } from "component";
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
  const { data, onClickRow, ...rest } = props;
  const [formData, setFormData] = useState({ item: [{ ...itemDef() }] });
  const [listItem, setListItem] = useState([]);
  let itemRef = useRef([]);

  useEffect(() => {
    // console.log("data,", data);
  }, [data]);

  const handleClickRow = (type, item) => {
    console.log(`onClickRow(${type}, ${item});`);
    if (onClickRow) {
      onClickRow(type, item);
    }
  };

  const scheme = () => {
    return [
      {
        title: "Username",
        key: "user_name",
      },
      {
        title: "Email",
        key: "user_email",
      },
      {
        title: "Is Cashier",
        key: "is_cashier",
        cell: (rec) => {
          let color = rec.is_cashier ? "green" : "red";
          return <Tag color={color}>{rec.is_cashier ? "Yes" : "No"}</Tag>;
        },
      },
      {
        title: "Status",
        key: "status",
      },
      {
        title: "Action",
        key: "pos_user_branch_id",
        cell: (rec) => {
          return (
            <Space>
              <XButton
                type="update"
                onClick={() => handleClickRow("update", rec)}
              />
              <Popconfirm
                title="Are you sure to delete this data?"
                onConfirm={() => handleClickRow("delete", rec)}
                okText="Yes"
                cancelText="No"
              >
                <XButton type="delete" />
              </Popconfirm>
            </Space>
          );
        },
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
