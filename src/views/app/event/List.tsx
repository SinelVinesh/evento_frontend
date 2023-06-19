import React, {useEffect, useState} from "react";
import {ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {findAllEventEstimation} from "../../../services/Api";
import {EventEstimation, Paginated} from "../../../common/appTypes";
import {formatDateTime, formatNumber} from "../../../services/Format";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as EventEstimation[]);
  const [filter] = useState({page: 1} as Paginated);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllEventEstimation;
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
      selector: (row: EventEstimation) => row.event?.id,
      sortable: true
    },
    {
      name: "Nom",
      selector: (row: EventEstimation) => row.event?.name,
      sortable: true
    },
    {
      name: "Type d'évènement",
      selector: (row: EventEstimation) => row.event?.eventType?.name,
      sortable: true
    },
    {
      name: "Début",
      selector: (row: EventEstimation) => formatDateTime(row.event?.startDate!),
      sortable: true
    },
    {
      name: "Fin",
      selector: (row: EventEstimation) => formatDateTime(row.event?.endDate!),
      sortable: true
    },
    {
      name: "Status",
      selector: (row: EventEstimation) => row.event?.eventStatus?.name,
      sortable: true
    },
    {
      name: "Estimation (Ar)",
      selector: (row: EventEstimation) => formatNumber(row.totalExpense),
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
      title={"Liste des évènements"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
    />
  );
};

export default ConfiguredList;
