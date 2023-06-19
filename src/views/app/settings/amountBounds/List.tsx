import React, { useEffect, useState } from "react";
import { AmountBounds, AmountBoundsFilter } from "../../../../common/appTypes";
import { ListColumn } from "../../../../common/types";
import { findAllAmountBounds,} from "../../../../services/Api";
import List from "../../../../components/generic/List";
import { formatDate, formatNumber } from "services/Format";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as AmountBounds[]);
  const [filter] = useState({ page: 1 } as AmountBoundsFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllAmountBounds;
  const fnLink = (row: any) => `/cpus/${row.id}/update`;
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
      selector: (row: AmountBounds) => row.id,
      sortable: true
    },
    {
      name: "Date d'application",
      selector: (row: AmountBounds) => formatDate(row.date!),
      sortable: true
    },
    {
      name: "Montant maximale (Ar)",
      selector: (row: AmountBounds) => formatNumber(row.maxAmount),
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
