import { Table, Pagination, Row, Col, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { defaultFilter } from "../constants";
import XButton from "./XButton";

const DataTable = (props) => {
  const {
    items,
    columns,
    onClickAction,
    onChangePagination,
    totalData = 0,
  } = props;
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [data, setData] = useState({
    items: [],
    columns: [],
  });

  useEffect(() => {
    if (columns && items) generateColumn(columns);
  }, [columns, items]);

  useEffect(() => {
    console.log(`onChangePagination(${JSON.stringify(filter)});`);
    if (onChangePagination) {
      onChangePagination(filter);
    }
  }, [filter]);

  const generateColumn = (_column = Array) => {
    let formatCol = [];
    for (const it of _column) {
      let obj = it;
      obj.dataIndex = it.key;
      if (it.hasOwnProperty("action") && Array.isArray(it["action"])) {
        obj.render = (_e, record) =>
          it["action"].map((act, idx) => {
            if (act == "delete") {
              return (
                <Popconfirm
                  key={idx}
                  title="Are you sure to delete this data?"
                  onConfirm={() => handleClickAction(act, record[it.key])}
                  okText="Yes"
                  cancelText="No"
                >
                  <span key={idx}>
                    <XButton popover={act} type={act} />
                    &nbsp;
                  </span>
                </Popconfirm>
              );
            }
            return (
              <span key={idx}>
                <XButton
                  popover={act}
                  type={act}
                  onClick={() => handleClickAction(act, record[it.key])}
                />
                &nbsp;
              </span>
            );
          });
      }
      formatCol.push(obj);
    }
    setData({ ...data, items: items, columns: formatCol });
  };

  const handleClickAction = (type, id) => {
    console.log(`onClickAction(${type},${id});`);
    if (onClickAction) {
      onClickAction(type, id);
    }
  };
  const handleChangePagination = () => {
    console.log(`onChangePagination(${filter});`);
    if (onChangePagination) {
      onChangePagination(filter);
    }
  };

  return (
    <>
      <Table
        {...props}
        // rowKey="id"
        columns={data.columns}
        dataSource={data.items}
        pagination={false}
      />

      <Row style={{ padding: 30 }}>
        <Col span={16}>
          <Pagination
            defaultCurrent={filter.page}
            total={totalData}
            onChange={(page, limit) =>
              setFilter({ ...filter, page: page, limit: limit })
            }
          />
        </Col>
        <Col span={8}>
          <h3 style={{ marginRight: "0", float: "right" }}>
            Total Data: {totalData}
          </h3>
        </Col>
      </Row>
    </>
  );
};

export default DataTable;

const columns_old = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    // render: (text,record) => <a>{text}</a>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "id",
    render: (item, record) => (
      <>
        <XButton popover="Delete" type="delete" />
        &nbsp;
        <XButton popover="Update" type="update" />
        &nbsp;
        <XButton popover="Read" type="read" />
      </>
    ),
  },
];
