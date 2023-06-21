import React, {useEffect, useState} from "react";
import {ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {findAllEventEstimation} from "../../../services/Api";
import {EventEstimation, Paginated} from "../../../common/appTypes";
import {formatNumber} from "../../../services/Format";
import {useNavigate} from "react-router-dom";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as EventEstimation[]);
  const [filter] = useState({page: 1} as Paginated);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllEventEstimation;
  const fnLink = (row: any) => `/statistics/${row.id}`;
  const navigate = useNavigate();
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
      name: "Montant recette (Ar)",
      selector: (row: EventEstimation) => formatNumber(row.realIncome),
      sortable: true
    },
    {
      name: "Montant dépenses (Ar)",
      selector: (row: EventEstimation) => formatNumber(row.totalExpense),
      sortable: true
    },
    {
      name: "Montant Bénéfice brut (Ar)",
      selector: (row: EventEstimation) => formatNumber(row.realIncome! - row.totalExpense!),
      sortable: true
    },
    {
      name: "Taxe (Ar)",
      selector: (row: EventEstimation) => formatNumber((row.realIncome! - row.totalExpense!) < 0 ? 0 : row.event?.taxe! * (row.realIncome! - row.totalExpense!)) + ` (${row.event?.taxe! * 100}%)`,
      sortable: true
    },
    {
      name: "Bénéfice net (Ar)",
      selector: (row: EventEstimation) => formatNumber((row.realIncome! - row.totalExpense!) < 0 ? 0 : (1 - row.event?.taxe!) * (row.realIncome! - row.totalExpense!)),
      sortable: true
    },
  ];

  const filterData = () => {
    apiCall(filter)
      .then((response) => {
        const data = response.data.elements.filter((e: EventEstimation) => e.event?.eventStatus?.id === 3);
        setTotalRows(response.data.count);
        setData(data);
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
      title={"Statistiques des evenements"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
      linkFn={fnLink}
    />
  );
};

export default ConfiguredList;
