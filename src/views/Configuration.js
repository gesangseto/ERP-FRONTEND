import { Button, Card, Col, Form, Row, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { XInput, XInputNumber, XSwitch } from "component";
import { getBase64, isJsonString } from "helper/utils";
import { getConfiguration, updateConfiguration } from "resource";

const Configuration = () => {
  const navigate = useNavigate();
  const form = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({ barcode_config: {} });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    form.current.resetFields();
  }, [formData.id]);

  const loadData = async () => {
    let _data = await getConfiguration();
    if (_data) {
      _data = _data.data[0];
      let barcode_cfg = _data.barcode_config;
      if (isJsonString(barcode_cfg)) {
        barcode_cfg = JSON.parse(barcode_cfg);
      }
      setFormData({ ..._data, barcode_config: barcode_cfg });
      setFileList([
        {
          uid: "-1",
          name: "app_logo",
          status: "done",
          url: _data.app_logo,
        },
      ]);
    }
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (e) => {
    let body = {
      ...formData,
      ...e,
      barcode_config: JSON.stringify(formData.barcode_config),
    };
    let img = "";
    if (fileList[0].hasOwnProperty("url")) {
      img = fileList[0].url;
    } else if (fileList[0].hasOwnProperty("originFileObj")) {
      img = await getBase64(fileList[0].originFileObj);
    }
    body.app_logo = img;
    saveFormData(body);
  };

  const saveFormData = async (body = Object) => {
    let _data = updateConfiguration(body);
    if (_data) {
      toast.success("Success");
      // navigate(-1);
    }
  };

  const handleChangeConfigBarcode = (val, key) => {
    let config = formData.barcode_config;
    config[key] = val;
    setFormData({ ...formData, barcode_config: config });
  };
  return (
    <Card title={"Configuration"} style={{ textTransform: "capitalize" }}>
      <Form
        ref={form}
        onFinish={(e) => handleSubmit(e)}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        size={"default"}
      >
        <XInput
          title="App Name"
          name={"app_name"}
          initialValue={formData.app_name}
          required
        />
        <Row>
          <Col span={4}>
            <p style={{ float: "right", marginRight: 10 }}>App Logo : </p>
          </Col>
          <Col span={12}>
            <ImgCrop rotate>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                onChange={(e) => handleChange(e)}
                onPreview={onPreview}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Col>
        </Row>
        <XInput
          title="Username Root"
          name={"user_name"}
          initialValue={formData.user_name}
          required
        />
        <XInput
          title="Password Root"
          name={"user_password"}
          initialValue={formData.user_password ?? ""}
          type="password"
        />
        <XInputNumber
          title="Expired Token"
          name={"expired_token"}
          initialValue={formData.expired_token}
          addonAfter={"Days"}
        />
        <XSwitch
          title="Multi Login"
          name={"multi_login"}
          initialValue={formData.multi_login}
        />
        <Card title="Barcode Print Config">
          <Row>
            {Object.keys(formData.barcode_config).map((key, index) => {
              return (
                <Col span={12} key={index}>
                  <XInput
                    useForm={false}
                    title={key}
                    name={key}
                    required={false}
                    initialValue={formData.barcode_config[key] ?? ""}
                    onChange={(e) =>
                      handleChangeConfigBarcode(e.target.value, key)
                    }
                  />
                </Col>
              );
            })}
          </Row>
        </Card>
        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          &nbsp;
          <Button type="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Configuration;
