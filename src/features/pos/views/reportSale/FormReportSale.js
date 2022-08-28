import { Button, Card, Descriptions, Form, Tag } from "antd";
import { XButton, XFormApproval, XInput, XTable } from "component";
import { getRoute, numberWithComma } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getReportSale } from "features/pos/resource";
import moment from "moment";
import { insertCustomer, updateCustomer } from "resource";

const FormReportSale = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ detail: [] });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    if (formData.hasOwnProperty("pos_cashier_id")) form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getReportSale({ pos_cashier_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.pos_trx_inbound_id = id;
      _data = await updateCustomer(param);
    } else {
      _data = await insertCustomer(param);
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
        <XInput
          title="Branch"
          name={"pos_branch_code"}
          initialValue={formData.pos_branch_code}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Created at"
          name={"created_at"}
          initialValue={moment(formData.created_at).format(
            "YYYY-MM-DD HH:mm:ss"
          )}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Created By"
          name={"user_name"}
          initialValue={formData.user_name}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Status Cashier"
          name={"is_cashier_open"}
          initialValue={formData.is_cashier_open ? "Open" : "Close"}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Shift"
          name={"pos_cashier_shift"}
          initialValue={formData.pos_cashier_shift}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Number"
          name={"pos_cashier_number"}
          initialValue={formData.pos_cashier_number}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Cash Collect"
          name={"grand_total"}
          initialValue={numberWithComma(formData.grand_total)}
          disabled={type == "read"}
          addonBefore={"Rp"}
          required
        />
        <XInput
          title="Cash Capital"
          name={"pos_cashier_capital_cash"}
          initialValue={numberWithComma(formData.pos_cashier_capital_cash)}
          disabled={type == "read"}
          addonBefore={"Rp"}
          required
        />

        <XTable
          rowKey="pos_trx_sale_id"
          columns={columns()}
          items={formData.detail}
          totalData={formData.detail.length}
        />
        <Form.Item>
          <Button type="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default FormReportSale;

const columns = () => {
  return [
    {
      title: "Branch",
      key: "pos_branch_code",
    },
    {
      title: "INVOICE",
      key: "pos_trx_sale_id",
    },
    {
      title: "Date",
      key: "created_at",
      render: (i, rec) => <p>{moment(i).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: "Created By",
      key: "user_name",
    },
    {
      title: "Customer",
      key: "mst_customer_name",
    },
    {
      title: "Phone",
      key: "mst_customer_phone",
    },
    {
      title: "Total Price",
      key: "total_price",
      render: (i, rec) => <>Rp. {numberWithComma(i)}</>,
    },
    {
      title: "PPN",
      key: "ppn",
      render: (i, rec) => <>{i ?? 0} %</>,
    },
    {
      title: "Discount",
      key: "total_discount",
      render: (i, rec) => <>{i ?? 0} %</>,
    },
    {
      title: "Grand Total",
      key: "grand_total",
      render: (i, rec) => <>Rp. {numberWithComma(i)}</>,
    },
    {
      title: "Status",
      key: "status",
      render: (i, rec) => (
        <p
          style={{
            color:
              rec.status == 1 ? "green" : rec.status == -1 ? "blue" : "red",
          }}
        >
          {rec.status == 1
            ? "Active"
            : rec.status == -1
            ? "Rejected"
            : "Inactive"}
        </p>
      ),
    },
    {
      title: "Pay Status",
      key: "is_paid",
      render: (i, rec) => {
        let color = rec.is_paid ? "green" : "red";
        return (
          <Tag color={color} key={i}>
            {rec.is_paid ? "Paid" : "Not Paid"}
          </Tag>
        );
      },
    },
  ];
};
