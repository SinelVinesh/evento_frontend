import { CButton } from "@coreui/react";
import Spinner from "components/Spinner";
import React, { useEffect, useState } from "react";
import { formatDate, formatNumber } from "services/Format";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RefillRequest, RefillRequestFilter } from "../../../common/appTypes";
import { ListColumn } from "../../../common/types";
import List from "../../../components/generic/List";
import { findAllRefillRequest, updateRefillRequest } from "../../../services/Api";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as RefillRequest[]);
  const [filter] = useState({ page: 1 } as RefillRequestFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllRefillRequest;
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
      selector: (row: RefillRequest) => row.id,
      sortable: true
    },
    {
      name: "Date de la demande",
      selector: (row: RefillRequest) => formatDate(row.requestDate!),
      sortable: true
    },
    {
      name: "Utilisateur",
      selector: (row: RefillRequest) => row.user?.username,
      sortable: true
    },
    {
      name: "Montant demandé (Ar)",
      selector: (row: RefillRequest) => formatNumber(row.amount),
      sortable: true
    },
    {
      name: "Statut",
      selector: (row: RefillRequest) => row.refillState?.name,
      sortable: true
    },
    {
      name: "",
      selector: (row: RefillRequest) => (
      <>
        {row.refillState?.id === 1 && (
        <>
          <CButton color="success" className="mx-1" onClick={() => updateRequest(row.id!,{...row, refillState: {id: 2}})}>Accepter</CButton>
          <CButton color="danger" onClick={() => updateRequest(row.id!,{...row, refillState: {id: 3}})}>Refuser</CButton>
        </>
        )}
        {row.refillState?.id === 3 && (
        <>
          <CButton color="warning" onClick={() => updateRequest(row.id!,{...row, refillState: {id: 1}})}>Restaurer</CButton>
        </>
        )}
      </>
      ),
      sortable: false
    }
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

  const updateRequest = (id: number, newData: RefillRequest) => {
    const swal = withReactContent(Swal);
    const loading = {
      title: "Mis a jour en cours...",
      html: (
        <div style={{ overflow: "hidden" }}>
          <Spinner />
        </div>
      ),
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false
    };
    swal.fire(loading);
    updateRefillRequest(id, newData)
      .then((response) => {
        const swalData = {
          icon: "success" as SweetAlertIcon,
          title: "La demande a été mise à jour avec succès",
          timer: 1000,
          showConfirmButton: false
        };
        swal.close();
        swal.fire(swalData).then(() => {
          setTriggerFilter(!triggerFilter);
        });
        console.log(response);
      })
      .catch((error) => {
        const swalData = {
          icon: "error" as SweetAlertIcon,
          title: "Une erreur est survenue lors de la mise à jour de la demande",
          text: error.response.data.message
        };
        swal.fire(swalData);
        console.log(error);
      });
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
      title={"Liste des demandes de rechargement de compte"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
    />
  );
};

export default ConfiguredList;
