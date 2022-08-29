import { Card, Tag } from "antd";
import { XButton, XTableV2 } from "component";
import { defaultFilter } from "constants";
import { getRoute } from "helper/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteSection, getSection } from "resource";

const ListRole = () => {
  const route = getRoute();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    let _data = await getSection(filter);
    if (_data) {
      setTotalData(_data.grand_total);
      setListData([..._data.data]);
    }
  };

  const handleClickAction = async (action, id) => {
    if (action == "delete") {
      if (await deleteSection({ user_section_id: id })) {
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
        columns={roleColumns()}
        items={listData}
        totalData={totalData}
        onChangePagination={(e) => setFilter({ ...e })}
        onClickAction={(type, id) => handleClickAction(type, id)}
      />
    </Card>
  );
};

export default ListRole;

const roleColumns = () => {
  return [
    {
      title: "ID",
      key: "user_section_id",
    },
    {
      title: "Dept Code",
      key: "user_department_code",
    },
    {
      title: "Dept Name",
      key: "user_department_name",
    },
    {
      title: "Code",
      key: "user_section_code",
    },
    {
      title: "Name",
      key: "user_section_name",
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
      key: "user_section_id",
      action: ["update", "read"],
    },
  ];
};
