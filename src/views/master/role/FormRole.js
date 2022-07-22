import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Table,
  Tabs,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  findOnArr,
  groupBy,
  mergeArray,
  removeEmptyChild,
  treeify,
} from "../../../helper/utils";
import { getRole, getSection, updateRole } from "../../../resource";
import routes from "../../../routes";

const { TabPane } = Tabs;
const FormRole = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_department_code: "",
    user_department_name: "",
    user_section_name: "",
    user_section_code: "",
  });
  const [listRole, setListRole] = useState([]);
  const [checkedRole, setCheckedRole] = useState([]);
  const [groupRole, setGroupRole] = useState({});

  useEffect(() => {
    (async function () {
      if (id) {
        await loadFormData(id);
        await loadListRole(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getSection({ user_section_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };
  const loadListRole = async (id) => {
    let _data = await getRole({ user_section_id: id, show_all: true });
    _data = _data.data;
    let reformat = treeify(_data, "sys_menu_id", "sys_menu_parent_id");
    let rmChild = removeEmptyChild(reformat, "children");
    console.log(rmChild);
    let grouping = groupBy(rmChild, "sys_menu_module_name");
    setGroupRole({ ...grouping });
    setListRole([..._data]);
  };

  const handleChangeRow = (e) => {
    let RECORD = mergeArray(checkedRole, e, "sys_menu_id");
    setCheckedRole([...RECORD]);
  };

  const saveFormData = async (param = Object) => {
    let _body = mergeArray(listRole, checkedRole, "sys_menu_id");
    let _data = updateRole(_body);
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
        onFinish={(e) => handleSubmit(e)}
        labelCol={{
          span: 8,
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
        <Row>
          <Col span={12}>
            <Form.Item
              initialValue={formData.user_department_code}
              label="Department Code"
              name="user_department_code"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              initialValue={formData.user_department_name}
              label="Department Name"
              name="user_department_name"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              initialValue={formData.user_section_code}
              label="Section Code"
              name="user_section_code"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              initialValue={formData.user_section_name}
              label="Section Name"
              name="user_section_name"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" tabPosition={"left"}>
          {Object.keys(groupRole).map((key, index) => {
            return (
              <TabPane tab={key} key={index}>
                <RenderTable
                  data={groupRole[key]}
                  onChange={(e) => handleChangeRow(e)}
                />
              </TabPane>
            );
          })}
          {/* {[...Array.from({ length: 30 }, (_, i) => i)].map((i) => (
            <TabPane tab={`Tab-${i}`} key={i} disabled={i === 28}>
              Content of tab {i}
            </TabPane>
          ))} */}
        </Tabs>
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
    </Card>
  );
};
export default FormRole;

const RenderTable = (props) => {
  const { data, onChange } = props;
  const [_data, set_data] = useState([]);
  useEffect(() => {
    if (onChange) {
      onChange(_data);
    }
  }, [_data]);

  const handleChecked = (record, type, value) => {
    let RECORD = [..._data];
    let index = findOnArr({
      str: record["sys_menu_id"],
      key: "sys_menu_id",
      array: RECORD,
    });
    record[`flag_${type}`] = value;
    if (index >= 0) {
      RECORD[index] = record;
    } else {
      RECORD.push(record);
    }
    set_data([...RECORD]);
  };

  const thisColumns = () => {
    return [
      {
        title: "Menu",
        key: "sys_menu_name",
        dataIndex: "sys_menu_name",
      },
      {
        title: "Create",
        key: "flag_create",
        dataIndex: "flag_create",
        render: (_, record) => {
          if (!record.children) {
            return (
              <RenderChecbox
                initialValue={record.flag_create}
                onChange={(e) => handleChecked(record, "create", e)}
              />
            );
          }
        },
      },
      {
        title: "Read",
        key: "flag_read",
        dataIndex: "flag_read",
        render: (_, record) => {
          if (!record.children) {
            return (
              <RenderChecbox
                initialValue={record.flag_read}
                onChange={(e) => handleChecked(record, "read", e)}
              />
            );
          } else {
            <>{_}</>;
          }
        },
      },
      {
        title: "Update",
        key: "flag_update",
        dataIndex: "flag_update",
        render: (_, record) => {
          if (!record.children) {
            return (
              <RenderChecbox
                initialValue={record.flag_update}
                onChange={(e) => handleChecked(record, "update", e)}
              />
            );
          }
        },
      },
      {
        title: "Delete",
        key: "flag_delete",
        dataIndex: "flag_delete",
        render: (_, record) => {
          if (!record.children) {
            return (
              <RenderChecbox
                initialValue={record.flag_delete}
                onChange={(e) => handleChecked(record, "delete", e)}
              />
            );
          }
        },
      },
    ];
  };

  const RenderChecbox = (prop) => {
    const { initialValue, onChange } = prop;
    return (
      <Checkbox
        defaultChecked={initialValue ? true : false}
        onChange={(e) => {
          onChange(e.target.checked ? 1 : 0);
        }}
      />
    );
  };
  return (
    <Table
      // rowSelection={rowSelection}
      rowKey={"sys_menu_id"}
      showExpandColumn={true}
      style={{ margin: 20 }}
      columns={thisColumns()}
      dataSource={data}
    />
  );
};
