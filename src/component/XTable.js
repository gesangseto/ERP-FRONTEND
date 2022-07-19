import {
  Button,
  Col,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { defaultFilter } from "../constants";
import XButton from "./XButton";
import XFormApproval from "./XFormApproval";

const XTable = (props) => {
  const {
    items,
    columns,
    onClickAction,
    onChangePagination,
    totalData = 0,
  } = props;
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [search, setSearch] = useState([]);
  const [approvalId, setApprovalId] = useState(null);
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
                  key={`${act}${record[it.key]}`}
                  title="Are you sure to delete this data?"
                  onConfirm={() =>
                    handleClickAction(act, record[it.key], record)
                  }
                  okText="Yes"
                  cancelText="No"
                >
                  <XButton
                    popover={act}
                    type={act}
                    record={record}
                    style={{ float: "right", marginInline: 2 }}
                  />
                </Popconfirm>
              );
            }
            return (
              <XButton
                key={`${act}${record[it.key]}`}
                popover={act}
                type={act}
                record={record}
                onClick={() => handleClickAction(act, record[it.key], record)}
                style={{ float: "right", marginInline: 2 }}
              />
            );
          });
      }
      formatCol.push(obj);
    }
    setData({ ...data, items: items, columns: formatCol });
  };

  const handleClickAction = (type, id, record) => {
    if (type == "approve") {
      let rec = record.approval;
      setApprovalId(rec.approval_flow_id);
      return;
    }
    console.log(`onClickAction(${type},${id});`);
    if (onClickAction) {
      onClickAction(type, id);
    }
  };

  const handleClickSearch = () => {
    setFilter({ ...filter, search: search });
  };

  return (
    <>
      <Row style={{ paddingBlock: 10 }}>
        <Col span={12}>
          {/* <Search /> */}

          <Input.Group compact>
            <Select
              placeholder="Search anything"
              notFoundContent="Search anything"
              mode="tags"
              style={{ width: "70%" }}
              onChange={(e) => setSearch([...e])}
              tokenSeparators={[","]}
            />
            <Button onClick={() => handleClickSearch()}>Search</Button>
          </Input.Group>
        </Col>
      </Row>
      <XFormApproval
        approval_flow_id={approvalId}
        onCancel={() => setApprovalId(null)}
        onApprove={() => {
          setApprovalId(null);
          handleClickSearch();
        }}
      />
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

export default XTable;
