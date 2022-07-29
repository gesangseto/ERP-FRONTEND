import { Form, Select } from "antd";
import FormItem from "antd/lib/form/FormItem";
import React, { useEffect, useRef, useState } from "react";
import { getProduct } from "../resource";
const { Option } = Select;
let timeout;
let currentValue;

const XSelectSearch = (props, ref) => {
  const { option, onSearch, onChange, initialValue, name } = props;
  const [defaultValue, setDefaultValue] = useState();
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  useEffect(() => {
    setData([...option]);
  }, [option]);

  useEffect(() => {
    setDefaultValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (ref) ref.current?.resetFields();
  }, [defaultValue]);

  const handleSearch = (newValue) => {
    if (newValue) {
      if (onSearch) {
        onSearch(newValue);
      }
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue, item) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handlePressKey = (key) => {
    if (key === "Enter") {
      if (data[0] && onChange) {
        onChange(data[0].value);
      }
    }
  };

  const options = data.map((d) => (
    <Option key={d.value} item={d.item}>
      {d.text}
    </Option>
  ));

  return (
    <Form.Item ref={ref} name={name} initialValue={defaultValue}>
      <Select
        {...props}
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={{
          width: 200,
        }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        onInputKeyDown={(e) => handlePressKey(e.key)}
      >
        {options}
      </Select>
    </Form.Item>
  );
};

export default XSelectSearch;
