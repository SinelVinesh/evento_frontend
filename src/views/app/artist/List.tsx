import React, {useEffect, useState} from "react";
import {ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {formatNumber} from "services/Format";
import {filesUrl, findAllArtists} from "../../../services/Api";
import {Location, Paginated, RatedExpense} from "../../../common/appTypes";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as RatedExpense[]);
  const [filter] = useState({page: 1} as Paginated);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllArtists;
  const linkFn = (row: RatedExpense) => `/artists/${row.id}/update`;
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
      selector: (row: RatedExpense) => row.id,
      sortable: true
    },
    {
      name: "Image",
      selector: (row: Location) => <>{row.imageLink !== null && (
        <img src={`${filesUrl}/${row.imageLink}`} alt={row.name} style={{height: '220px'}}/>)}</>,
      sortable: true,
      minWidth: '400px'
    },
    {
      name: "Nom",
      selector: (row: RatedExpense) => row.name,
      sortable: true
    },
    {
      name: "Catégorie",
      selector: (row: RatedExpense) => row.ratedExpenseType?.name,
      sortable: true
    },
    {
      name: "Prix tarifaire (Ar)",
      selector: (row: RatedExpense) => formatNumber(row.rentPrice),
      sortable: true
    },
    {
      name: "Type de tarif",
      selector: (row: RatedExpense) => row.ratedExpenseType?.rateType?.name,
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
      title={"Liste des dépenses tarifées"}
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
