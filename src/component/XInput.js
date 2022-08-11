import { Col, Form, Input, Row, Space } from "antd";
import React from "react";

const XInput = (props) => {
  const {
    title,
    name,
    disabled,
    required,
    initialValue,
    onChange,
    typeInput = "string",
    rules,
    useForm = true,
  } = props;

  const handleChange = (e) => {
    let val = e.target.value;
    if (onChange) {
      onChange(val, e);
    }
  };

  return (
    <>
      {useForm ? (
        <Form.Item
          initialValue={initialValue}
          label={title ?? "No Title"}
          name={name}
          rules={
            rules ?? [
              {
                type: typeInput,
                required: required,
                message: `Please input your ${title}!`,
              },
            ]
          }
        >
          <Input
            disabled={disabled}
            onChange={(e) => handleChange(e)}
            {...props}
          />
        </Form.Item>
      ) : (
        <Row style={{ margin: 5 }}>
          <Col span={10}> {title}</Col>
          <Col span={10}>
            <Input
              defaultValue={initialValue}
              placeholder={title ?? "No Title"}
              disabled={disabled}
              onChange={(e) => handleChange(e)}
              {...props}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default XInput;
