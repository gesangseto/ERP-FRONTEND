import { Card, Tag } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getRoute } from "helper/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteApproval, getApproval } from "resource";

const ListApproval = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getApproval(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action == "delete") {
      if (await deleteApproval({ approval_id: id })) {
        loadData();
        toast.success(`Delete id ${id} successfully`);
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
        <XButton
          popover="Create"
          type="create"
          onClick={() => handleClickAdd()}
        />
      }
    >
      <XTableV2
        columns={tableSchema()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListApproval;

const tableSchema = () => {
  return [
    {
      title: "ID",
      key: "approval_id",
    },
    {
      title: "Approval",
      key: "approval_desc",
    },
    {
      title: "Approval 1",
      key: "approval_user_name_1",
    },
    {
      title: "Approval 2",
      key: "approval_user_name_2",
    },
    {
      title: "Approval 3",
      key: "approval_user_name_3",
    },
    {
      title: "Approval 4",
      key: "approval_user_name_4",
    },
    {
      title: "Approval 5",
      key: "approval_user_name_5",
    },
    {
      title: "Status",
      cell: (row) => {
        return (
          <Tag color={row.status ? "green" : "red"}>
            {row.status ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "approval_id",
      action: ["approve", "update", "read"],
    },
  ];
};
