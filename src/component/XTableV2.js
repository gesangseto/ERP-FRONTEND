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
import { defaultFilter } from "constants";
import XButton from "./XButton";
import XModalApproval from "./XModalApproval";
import DataTable from "react-data-table-component";

const XTableV2 = (props) => {
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
  const [structureColumns, setStructureColumns] = useState([]);

  useEffect(() => {
    if (columns) {
      generateColumn(columns);
    }
  }, [columns]);

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
      obj.name = obj.name || obj.title;
      obj.selector = (it) => it[obj.key];
      if (it.hasOwnProperty("action") && Array.isArray(it["action"])) {
        obj.cell = (_e, index) => {
          return it["action"].map((act, idx) => {
            let id = _e[it.key];
            if (!id) {
              return "NO KEY - ";
            }
            if (act == "delete") {
              return (
                <Popconfirm
                  key={`${act}${index[it.key]}`}
                  title="Are you sure to delete this data?"
                  onConfirm={() => handleClickAction(act, id, index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <XButton
                    popover={act}
                    type={act}
                    record={_e}
                    style={{ float: "right", marginInline: 2 }}
                  />
                </Popconfirm>
              );
            }
            return (
              <XButton
                key={`${act}${index}`}
                popover={act}
                type={act}
                record={_e}
                onClick={() => handleClickAction(act, id, index)}
                style={{ float: "right", marginInline: 2 }}
              />
            );
          });
        };
      }
      formatCol.push(obj);
    }
    setStructureColumns([...formatCol]);
  };

  const handleClickAction = (type, id, index) => {
    let record = items[index];
    console.log(id, record);
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
              style={{ width: 250 }}
              onChange={(e) => setSearch([...e])}
              tokenSeparators={[","]}
            />
            <Button onClick={() => handleClickSearch()}>Search</Button>
          </Input.Group>
        </Col>
      </Row>
      <XModalApproval
        approval_flow_id={approvalId}
        visible={approvalId}
        onCancel={() => setApprovalId(null)}
        onApprove={() => {
          setApprovalId(null);
          handleClickSearch();
        }}
      />
      <DataTable columns={structureColumns} data={[...items]} />
      {/* <Table
        {...props}
        // rowKey="id"
        columns={structureColumns}
        dataSource={[...items]}
        pagination={false}
        size="small"
      /> */}

      <Row style={{ padding: 30 }}>
        <Col span={16}>
          <Pagination
            current={filter.page}
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

export default XTableV2;
