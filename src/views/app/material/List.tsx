import React, {useEffect, useState} from "react";
import {ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {formatNumber} from "services/Format";
import {findAllMaterial} from "../../../services/Api";
import {Material, MaterialFilter} from "../../../common/appTypes";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as Material[]);
  const [filter] = useState({page: 1} as MaterialFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllMaterial;
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
      selector: (row: Material) => row.id,
      sortable: true
    },
    {
      name: "Nom",
      selector: (row: Material) => row.name,
      sortable: true
    },
    {
      name: "Prix de location (Ar)",
      selector: (row: Material) => formatNumber(row.rentPrice),
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
      title={"Liste des Matériels"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
    />
  );
};

export default ConfiguredList;
