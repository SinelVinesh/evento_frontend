import React, { useEffect, useState } from "react";
import { AmountBounds, AmountBoundsFilter, LoanDuration, LoanDurationFilter } from "../../../../common/appTypes";
import { ListColumn } from "../../../../common/types";
import { findAllAmountBounds, findAllLoanDuration,} from "../../../../services/Api";
import List from "../../../../components/generic/List";
import { formatDate, formatNumber } from "services/Format";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as LoanDuration[]);
  const [filter] = useState({ page: 1 } as LoanDurationFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllLoanDuration;
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
      selector: (row: LoanDuration) => row.id,
      sortable: true
    },
    {
      name: "Durée (mois)",
      selector: (row: LoanDuration) => formatNumber(row.duration, 0),
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
      title={"Liste des durées d'emprunt"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
    />
  );
};

export default ConfiguredList;
