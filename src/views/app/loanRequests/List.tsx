import {CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow} from "@coreui/react";
import Spinner from "components/Spinner";
import React, { useEffect, useState } from "react";
import { formatDate, formatNumber } from "services/Format";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoanRequest, RefillRequest, RefillRequestFilter } from "../../../common/appTypes";
import { ListColumn } from "../../../common/types";
import List from "../../../components/generic/List";
import { findAllLoanRequest, updateLoanRequest, updateRefillRequest } from "../../../services/Api";
import {TextField} from "@mui/material";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as LoanRequest[]);
  const [filter] = useState({ page: 1 } as RefillRequestFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loanRequest, setLoanRequest] = useState({} as LoanRequest);
  const linkFn = (row: LoanRequest) => `/loan-requests/${row.id}`;
  const apiCall = findAllLoanRequest;
  const json = sessionStorage.getItem("role") ?? ""
  const role = JSON.parse(json)
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
      selector: (row: LoanRequest) => row.id,
      sortable: true
    },
    {
      name: "Date de la demande",
      selector: (row: LoanRequest) => formatDate(row.requestDate!),
      sortable: true
    },
    {
      name: "Utilisateur",
      selector: (row: LoanRequest) => row.user?.username,
      sortable: true
    },
    {
      name: "Montant demandé (Ar)",
      selector: (row: LoanRequest) => formatNumber(row.amount),
      sortable: true
    },
    {
      name: "Taux d'intéret (%)",
      selector: (row: LoanRequest) => formatNumber((row.interestRate?.rate ?? 0) * 100),
      sortable: true
    },

    {
      name: "Statut",
      selector: (row: LoanRequest) => row.loanState?.name,
      sortable: true
    },
    {
      name: "",
      selector: (row: LoanRequest) => (
      <>
        {row.loanState?.id === 1 && role.id == "1" && (
        <>
          <CRow className="mb-2 mt-2">
            <CCol>
              <CButton color="success" onClick={() => {setModalVisible(true);setLoanRequest({...row, loanState: {id: 3}})}}>Accepter</CButton>
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol>
              <CButton color="danger" onClick={() => updateRequest(row.id!,{...row, loanState: {id: 3}})}>Refuser</CButton>
            </CCol>
          </CRow>
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

  const updateRequest = (id: number, newData: LoanRequest) => {
    setModalVisible(false);
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
    updateLoanRequest(id, newData)
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
    <>
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Pour accepter cette demande, veuillez saisir la date à laquelle débutera le remboursement</p>
          <CRow>
            <CCol>
              <TextField type={"month"} onChange={(e) => setLoanRequest({...loanRequest,refundStartDate: new Date(e.target.value).getTime()})}/>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => updateRequest(loanRequest.id!,{...loanRequest,loanState: {id: 2}})}>Confirmer</CButton>
        </CModalFooter>
      </CModal>
      <List
        data={data}
        columns={columns}
        title={"Liste des demandes de pret"}
        totalRows={totalRows}
        loading={loading}
        onChangePage={handlePageChange}
        filterData={filter}
        filterFn={filterFn}
        linkFn={linkFn}
      />
    </>
  );
};

export default ConfiguredList;
