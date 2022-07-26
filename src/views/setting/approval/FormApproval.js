import { Button, Card, Form, Input, Select, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval } from "../../../component";
import { canApprove } from "../../../helper/utils";
// import { updateDepartment } from "../../../resource/administrator/department";
import {
  getApproval,
  getUser,
  insertApproval,
  updateApproval,
} from "../../../resource";
import routes from "../../../routes";

const FormApproval = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [approval, setApproval] = useState({});
  const [formData, setFormData] = useState({
    approval_desc: "",
    approval_id: null,
    approval_ref_table: "",
    approval_user_id_1: null,
    approval_user_id_2: null,
    approval_user_id_3: null,
    approval_user_id_4: null,
    approval_user_id_5: null,
    status: 1,
  });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
      loadUser();
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.approval_id]);

  const loadFormData = async (id) => {
    let _data = await getApproval({ approval_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const loadUser = async (id) => {
    let _data = await getUser({ status: 1 });
    _data = _data.data;
    setListUser([..._data]);
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.approval_id = id;
      _data = await updateApproval(param);
    } else {
      _data = await insertApproval(param);
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

  const handleChangeUser = (user_id, index) => {
    let oldData = formData;
    oldData[`approval_user_id_${index}`] = user_id;
    setFormData({ ...oldData });
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
        <Form.Item
          initialValue={formData.approval_desc}
          label="Desc"
          name="approval_desc"
          rules={[
            {
              required: true,
              message: "Please input your Desc!",
            },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          initialValue={formData.approval_ref_table}
          label="ref Table"
          name="approval_ref_table"
          rules={[
            {
              required: true,
              message: "Please input your Ref Table!",
            },
          ]}
        >
          <Input></Input>
        </Form.Item>
        {[...Array(5)].map((it, idx) => {
          return (
            <Form.Item
              key={idx}
              initialValue={formData[`approval_user_id_${idx + 1}`]}
              label={`Approval User ${idx + 1}`}
              name={`approval_user_id_${idx + 1}`}
            >
              <Select
                showSearch
                allowClear
                onChange={(e) => handleChangeUser(e, idx + 1)}
                disabled={type == "read"}
              >
                {listUser.map((item, idx) => {
                  return (
                    <Select.Option key={idx} value={item.user_id}>
                      {item.user_email}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          );
        })}

        <Form.Item
          initialValue={formData.status}
          label="Status"
          valuePropName="checked"
          name="status"
        >
          <Switch disabled={type == "read"} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            disabled={type == "read"}
          >
            Save
          </Button>
          &nbsp;
          <Button type="danger" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
      <XFormApproval item={approval} />
    </Card>
  );
};
export default FormApproval;
