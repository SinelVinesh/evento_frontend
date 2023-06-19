import React, { useEffect, useState } from "react";
import { formatDate, formatNumber } from "services/Format";
import { InterestRate, InterestRateFilter } from "../../../../common/appTypes";
import { ListColumn } from "../../../../common/types";
import List from "../../../../components/generic/List";
import { findAllInterestRate } from "../../../../services/Api";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as InterestRate[]);
  const [filter] = useState({ page: 1 } as InterestRateFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllInterestRate;
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
      selector: (row: InterestRate) => row.id,
      sortable: true
    },
    {
      name: "Date d'application",
      selector: (row: InterestRate) => formatDate(row.date!),
      sortable: true
    },
    {
      name: "Taux d'intérêt (%)",
      selector: (row: InterestRate) => formatNumber(row.rate! *100),
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
    filter.page = currentPage;
    filterData();
  }, [currentPage]);
  return (
    <List
      data={data}
      columns={columns}
      title={"Historique des montants maximums de pret"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
    />
  );
};

export default ConfiguredList;
