import React, { useEffect, useState } from "react";
import { AmountBounds, AmountBoundsFilter, Client, ClientFilter, InterestRate, InterestRateFilter } from "../../../common/appTypes";
import { ListColumn } from "../../../common/types";
import { findAllAmountBounds, findAllClient, findAllInterestRate,} from "../../../services/Api";
import List from "../../../components/generic/List";
import { formatDate, formatNumber } from "services/Format";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as Client[]);
  const [filter] = useState({ page: 1 } as ClientFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllClient;
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
      selector: (row: Client) => row.id,
      sortable: true
    },
    {
      name: "Nom d'utilisateur",
      selector: (row: Client) => row.username,
      sortable: true
    },
    {
      name: "Solde (Ar)",
      selector: (row: Client) => formatNumber(row.balance),
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
      title={"Liste des clients"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
    />
  );
};

export default ConfiguredList;
