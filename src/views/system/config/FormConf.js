import { Button, Card, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval, XInput, XSelect } from "component";
import XSelectSearch from "component/XSelectSearch";
import { getRoute } from "helper/utils";

import {
  getConfigRelation,
  getConfigRelationList,
  updateConfigRelation,
} from "resource";

const FormConf = () => {
  const route = getRoute();
  let { type, id } = useParams();
  const navigate = useNavigate();
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [listItem, setListItem] = useState([]);
  const [formData, setFormData] = useState({
    sys_relation_code: "",
    sys_relation_ref_id: "",
    sys_relation_desc: "",
    sys_relation_name: "",
    sys_relation_id: "",
  });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    if (formData.sys_relation_id) loadListData(id);
    form.current?.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getConfigRelation({ sys_relation_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const loadListData = async () => {
    let table = formData.sys_relation_code.replace("_default", "");
    let id = formData.sys_relation_id;
    let _data = await getConfigRelationList({ sys_relation_id: id });
    _data = _data.data;
    let newData = [];
    for (const it of _data) {
      let opt = {
        label: it[`${table}_name`],
        value: it[`${table}_id`] + "",
        ...it,
      };
      newData.push(opt);
    }
    setListItem([...newData]);
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.sys_relation_id = id;
      _data = await updateConfigRelation(param);
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
          title="Code Database"
          name={"sys_relation_code"}
          initialValue={formData.sys_relation_code}
          disabled
        />
        <XInput
          title="Name"
          name={"sys_relation_name"}
          initialValue={formData.sys_relation_name}
          disabled={type == "read"}
          required
        />
        <XInput
          title="Description"
          name={"sys_relation_desc"}
          initialValue={formData.sys_relation_desc}
          disabled={type == "read"}
          required
        />
        <XSelect
          title="Ref Data"
          name={"sys_relation_ref_id"}
          initialValue={formData.sys_relation_ref_id}
          disabled={type == "read"}
          required
          option={listItem}
        />
        <Form.Item>
          <Button
            loading={loading}
            type="success"
            htmlType="submit"
            disabled={type == "read"}
          >
            Save
          </Button>
          &nbsp;
          <Button type="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
      <XFormApproval item={formData} />
    </Card>
  );
};
export default FormConf;
