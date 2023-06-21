import React, {useEffect, useState} from "react";
import {ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {findAllSetting} from "../../../services/Api";
import {Paginated, Setting} from "../../../common/appTypes";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as Setting[]);
  const [filter] = useState({page: 1} as Paginated);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllSetting;
  const linkFn = (row: Setting) => `/settings/${row.id}/update`;

  const handlePageChange = (page: number) => {
    setLoading(true);
    if (currentPage !== page) {
      setCurrentPage(page);
      filterData();
    }
  };

  const columns: ListColumn[] = [
    {
      name: "Id",
      selector: (row: Setting) => row.id,
      sortable: true
    },
    {
      name: "Nom",
      selector: (row: Setting) => row.name,
      sortable: true
    },
    {
      name: "Valeur",
      selector: (row: Setting) => row.value,
      sortable: true
    }
  ];

  const filterData = () => {
    apiCall(filter)
      .then((response) => {
        setTotalRows(response.data.count);
        setData(response.data.elements);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filterFn = () => {
    setTriggerFilter(!triggerFilter);
  };

  useEffect(() => {
    filterData();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [data]);
  useEffect(() => {
    handlePageChange(1);
  }, [triggerFilter]);
  useEffect(() => {
    if (filter.page !== currentPage) {
      filter.page = currentPage;
      filterData();
    }
  }, [currentPage]);
  return (
    <List
      data={data}
      columns={columns}
      title={"Liste des paramètres"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
      linkFn={linkFn}
    />
  );
};

export default ConfiguredList;
