import { Button, Card, Col, Divider, Form, Modal, Row } from "antd";
import { XButton, XFormApproval, XInput, XSwitch, XTextArea } from "component";
import { getRoute } from "helper/utils";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import XSelectSearch from "component/XSelectSearch";
import { XTableDetailUser } from "features/pos/component";
import {
  deleteUserBranch,
  getUserBranch,
  insertUserBranch,
  updateUserBranch,
} from "features/pos/resource";
import { getUser } from "resource";

const FormUserBranch = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const formUserBranch = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...{}, detail: [] });
  const [selectedData, setSelectedData] = useState({});
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.pos_branch_id]);

  const loadFormData = async (id) => {
    let _data = await getUserBranch({ pos_branch_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const loadUser = async (e) => {
    let filter = { page: 1, limit: 10, search: e };
    let _data = await getUser(filter);
    if (_data) {
      setListUser([..._data.data]);
    } else {
      setListUser([]);
    }
  };

  const handleClickRow = async (type, item) => {
    loadUser(item.user_name);
    if (type === "update" || type === "create") {
      formUserBranch.current?.resetFields();
      setSelectedData(item);
    } else {
      let res = await deleteUserBranch({
        pos_user_branch_id: item.pos_user_branch_id,
      });
      if (res) {
        toast.success("Success delete data");
        loadFormData(id);
      }
    }
  };
  const saveFormData = async (param = Object) => {
    let _body = { ...param, pos_branch_code: formData.pos_branch_code };
    if (!_body.user_id) {
      return toast.error("User is required");
    }
    let _data = false;
    if (param.pos_user_branch_id) {
      _data = await updateUserBranch(_body);
    } else {
      _data = await insertUserBranch(_body);
    }
    if (_data) {
      toast.success("Success");
      loadFormData(id);
      setSelectedData({});
    }
  };

  const handleSubmit = async () => {
    let e = selectedData;
    e.status = e.status ? 1 : 0;
    saveFormData(e);
  };

  return (
    <Card title={route.name} style={{ textTransform: "capitalize" }}>
      <Form
        ref={form}
        defaultValue={formData}
        // onFinish={(e) => handleSubmit(e)}
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
          title="Branch Name"
          name={"pos_branch_name"}
          initialValue={formData.pos_branch_name}
          disabled
        />
        <XInput
          title="Branch Code"
          name={"pos_branch_code"}
          initialValue={formData.pos_branch_code}
          disabled
        />
        <XInput
          title="Desc"
          name={"pos_branch_desc"}
          initialValue={formData.pos_branch_desc}
          disabled
        />
        <XInput
          title="Phone"
          name={"pos_branch_phone"}
          initialValue={formData.pos_branch_phone}
          disabled
        />
        <XTextArea
          title="Address"
          name={"pos_branch_address"}
          initialValue={formData.pos_branch_address}
          disabled
        />
        <Divider orientation="right">
          <XButton
            title="Add User"
            type="create"
            onClick={() =>
              handleClickRow("create", {
                pos_branch_id: formData.pos_branch_id,
                user_id: null,
                status: 1,
                is_cashier: false,
              })
            }
          />
        </Divider>
        <XTableDetailUser
          data={formData.detail}
          onClickRow={(type, item) => handleClickRow(type, item)}
        />
        <br />
        <br />
        <br />

        <Form.Item>
          <Button type="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="User On branch"
        visible={Object.keys(selectedData).length > 0}
        onCancel={() => setSelectedData({})}
        onOk={() => handleSubmit()}
      >
        <Form
          ref={formUserBranch}
          defaultValue={selectedData}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          layout="horizontal"
        >
          <Row>
            <Col span={6}>
              <p style={{ float: "right", marginInline: 10 }}>User: </p>
            </Col>
            <Col span={16}>
              <XSelectSearch
                allowClear
                required
                disabled={selectedData.pos_user_branch_id}
                title="User"
                placeholder="Input search text"
                name="user_id"
                onSearch={(e) => loadUser(e)}
                option={listUser.map((it) => {
                  return {
                    text: `(${it.user_name}) ${it.user_email} ${it.user_phone}`,
                    value: it.user_id,
                  };
                })}
                onChange={(val) =>
                  setSelectedData({ ...selectedData, user_id: val })
                }
                initialValue={selectedData.user_id}
              />
            </Col>
          </Row>
          <br />
          <XSwitch
            title="Is Cashier"
            name={"is_cashier"}
            initialValue={selectedData.is_cashier}
            onChange={(val) =>
              setSelectedData({ ...selectedData, is_cashier: val })
            }
          />
          <XSwitch
            title="Status"
            name={"status"}
            initialValue={selectedData.status}
            onChange={(val) =>
              setSelectedData({ ...selectedData, status: val ? 1 : 0 })
            }
          />
        </Form>
      </Modal>
      <XFormApproval item={formData} />
    </Card>
  );
};
export default FormUserBranch;
