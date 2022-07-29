import { Select } from "antd";
import React, { useEffect, useState } from "react";
const { Option } = Select;

const XSelectSearch = (props, ref) => {
  const { option, onSearch, onChange, initialValue, initialText } = props;
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setData([...option]);
    setValue(initialValue);
  }, [option, initialValue]);

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

  return (
    // <Form.Item ref={ref} name={name} initialValue={defaultValue}>
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
      {data.map((d, index) => (
        <Option key={index} value={d.value}>
          {d.text}
        </Option>
      ))}
    </Select>
    // </Form.Item>
  );
};

export default XSelectSearch;
