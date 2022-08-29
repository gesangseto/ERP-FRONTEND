import {
  Button,
  Col,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Tag,
} from "antd";
import { defaultFilter } from "constants";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import XButton from "./XButton";
import XModalApproval from "./XModalApproval";
import moment from "moment";

const XTableV2 = (props) => {
  const {
    items,
    columns,
    onClickAction,
    onChangePagination,
    searchable = true,
    pagination = true,
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
      if (it.key === "status") {
        obj.cell = (row) => {
          let color =
            row.status == 1 ? "green" : row.status == -1 ? "blue" : "red";
          let title =
            row.status == 1
              ? "Active"
              : row.status == -1
              ? "Rejected"
              : "Inactive";
          return <Tag color={color}>{title}</Tag>;
        };
      } else if (it.hasOwnProperty("action") && Array.isArray(it["action"])) {
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
      {searchable ? (
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
      ) : null}
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

      {pagination ? (
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
      ) : null}
    </>
  );
};

export default XTableV2;
