import { Button, Card, Popover, Space, Tag } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteWhType, getWhType } from "features/warehouse/resource";
import { getRoute } from "helper/utils";
import { toast } from "react-toastify";
import { XModalFlow } from "features/warehouse/component";

const ListWhType = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [openModalFLow, setOpenModalFLow] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getWhType(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action === "delete") {
      let res = await deleteWhType({ wh_mst_wh_type_id: id });
      if (res) {
        toast.success("Delete successfully");
        loadData();
      }
      return;
    }
    navigate(`${route.path}/${action}/${id}`);
  };
  const handleClickAdd = () => {
    navigate(`${route.path}/create`);
  };
  return (
    <Card
      title={route.name}
      style={{ textTransform: "capitalize" }}
      extra={
        <Space>
          <Popover content={"Flow Config"}>
            <Button onClick={() => setOpenModalFLow(true)} size="small">
              Flow
            </Button>
          </Popover>
          <XButton
            popover="Create"
            type="create"
            onClick={() => handleClickAdd()}
          />
        </Space>
      }
    >
      <XModalFlow
        visible={openModalFLow}
        onCancel={() => setOpenModalFLow(false)}
        // onSubmit={(item) => handleSubmitCashier(item)}
        // initialValue={cashierData}
      />
      <XTableV2
        columns={columns()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListWhType;

const columns = () => {
  return [
    {
      title: "Code",
      key: "wh_mst_wh_type_code",
    },
    {
      title: "Name",
      key: "wh_mst_wh_type_name",
    },
    {
      title: "Desc",
      key: "wh_mst_wh_type_desc",
    },
    {
      title: "Pack",
      key: "support_packing",
      cell: (row) => {
        let color = row.support_packing ? "green" : "red";
        let title = row.support_packing ? "Yes" : "No";
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "Operation",
      key: "support_operation",
      cell: (row) => {
        let color = row.support_operation ? "green" : "red";
        let title = row.support_operation ? "Yes" : "No";
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "Transfer",
      key: "support_transfer",
      cell: (row) => {
        let color = row.support_transfer ? "green" : "red";
        let title = row.support_transfer ? "Yes" : "No";
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "Picking",
      key: "support_picking",
      cell: (row) => {
        let color = row.support_picking ? "green" : "red";
        let title = row.support_picking ? "Yes" : "No";
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "Return",
      key: "support_return",
      cell: (row) => {
        let color = row.support_return ? "green" : "red";
        let title = row.support_return ? "Yes" : "No";
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      title: "Status",
      key: "status",
    },
    {
      title: "",
      key: "wh_mst_wh_type_id",
      action: ["approve", "delete", "update", "read"],
    },
  ];
};
