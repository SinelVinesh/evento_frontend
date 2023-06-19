import React, {useEffect, useState} from "react";
import {formatNumber} from "services/Format";
import {MonthlyProfit, MonthlyProfitFilter, MonthlyRefund, MonthlyRefundFilter} from "../../../common/appTypes";
import {Filter, ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {findAllMonthlyProfit, findAllRefundSummary} from "../../../services/Api";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {FieldType} from "../../../common/enums";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as MonthlyProfit[]);
  const [filter] = useState({ page: 1 } as MonthlyProfitFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllMonthlyProfit;
  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    if (currentPage === page) {
      filterData();
    }
  };

  const columns: ListColumn[] = [
    {
      name: "Id",
      selector: (row: MonthlyProfit) => row.id,
      sortable: true
    },
    {
      name: "Période",
      selector: (row: MonthlyProfit) => format(new Date(row.year!,row.month!-1,1),"MMMM yyyy", {locale: fr}),
      sortable: true
    },
    {
      name: "Bénéfice (Ar)",
      selector: (row: MonthlyProfit) => formatNumber(row.totalProfit),
      sortable: true
    }
  ];

  const filters: Filter[] = [
    {
      label: 'Mois minimum',
      name: 'minMonth',
      filterInputType: FieldType.number
    },
    {
      label: 'Année minimum',
      name: 'minYear',
      filterInputType: FieldType.number
    },
    {
      label: 'Mois maximum',
      name: 'maxMonth',
      filterInputType: FieldType.number
    },
    {
      label: 'Année maximum',
      name: 'maxYear',
      filterInputType: FieldType.number
    }
  ]

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
    filter.page = currentPage;
    filterData();
  }, [currentPage]);
  return (
    <List
      data={data}
      columns={columns}
      title={"Liste des bénéfices mensuels"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
      filters={filters}
    />
  );
};

export default ConfiguredList;
