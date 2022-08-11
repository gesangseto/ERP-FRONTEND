import { useEffect, useState } from "react";
import { defaultFilter } from "constants";
import { getUser } from "resource";

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [datas, setDatas] = useState([]);
  const [filter, setFilter] = useState({ ...defaultFilter });
  const [data, setData] = useState({
    user_id: "",
    user_name: "",
    user_email: "",
    user_department_id: "",
    user_section_id: "",
    status: "",
  });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    console.log("Load data");
    try {
      let _data = await getUser(filter);
      console.log("Load data", _data);
      setTotalData(_data.grand_total);
      setDatas([..._data.data]);
      setData({ ..._data.data[0] });
    } catch (error) {
      console.log(error);
      setIsError(error.message);
    }
  };

  const changeFilter = (e) => {
    setFilter({ ...e });
  };

  return [data, datas, totalData, isLoading, isError, changeFilter];
};
