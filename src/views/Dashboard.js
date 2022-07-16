import { Card } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { XButton, XTable } from "../component";
import { defaultFilter } from "../constants";
import { userColumns } from "../constants/columnTable";
import { dummyData } from "../helper/dummy";

const Dashboard = () => {
  const [listData, setListData] = useState([]);
  const [filter, setFilter] = useState({ ...defaultFilter });

  useEffect(() => {
    loadData();
  }, [filter]);

  // const loadData = async () => {
  //   setListData([...dummyData(filter.limit)]);
  // };

  const loadData = useCallback(async () => {
    setListData([...dummyData(filter.limit)]);
  }, []);

  return (
    <Card
      title="Default size card"
      extra={<XButton popover="Create" type="create" />}
    >
      <XTable
        columns={userColumns}
        items={listData}
        totalData={786}
        pagination={(e) => console.log(e)}
        onChangePagination={(e) => setFilter({ ...e })}
      />
    </Card>
  );
};

export default Dashboard;
