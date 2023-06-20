import React, {useEffect, useState} from "react";
import {ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {filesUrl, findAllLocation} from "../../../services/Api";
import {Location, Paginated} from "../../../common/appTypes";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as Location[]);
  const [filter] = useState({page: 1} as Paginated);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllLocation;
  const linkFn = (row: Location) => `/locations/${row.id}/update`;
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
      selector: (row: Location) => row.id,
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
      selector: (row: Location) => row.name,
      sortable: true
    },
    {
      name: "Nombre de places",
      selector: (row: Location) => row.locationSeatCategories?.reduce((acc, locationSeatCategory) => acc + locationSeatCategory.capacity!, 0),
      sortable: true
    },
    {
      name: "Type de lieu",
      selector: (row: Location) => row.locationType?.name,
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
      title={"Liste des Lieux"}
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
