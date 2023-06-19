import React, {useEffect, useState} from "react";
import {ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {findAllRatedExpenseType} from "../../../services/Api";
import {Paginated, RatedExpenseType} from "../../../common/appTypes";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as RatedExpenseType[]);
  const [filter] = useState({page: 1} as Paginated);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllRatedExpenseType;
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
      selector: (row: RatedExpenseType) => row.id,
      sortable: true
    },
    {
      name: "Nom",
      selector: (row: RatedExpenseType) => row.name,
      sortable: true
    },
    {
      name: "Type de tarif",
      selector: (row: RatedExpenseType) => row.rateType?.name,
      sortable: true
    },
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
      title={"Liste des types de dépenses tarifées"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
    />
  );
};

export default ConfiguredList;
