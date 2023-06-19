import Sheet from "components/generic/Sheet";
import React, { useEffect, useState } from "react";
import avatar from "../assets/images/avatars/1.jpg";
import { SheetSectionProperties } from "../../../common/types";
import { SheetSectionType } from "../../../common/enums";
import {LoanRefundPlan, LoanRequest} from "../../../common/appTypes";
import {formatNumber} from "../../../services/Format";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {findLoanRequest, updateLoanRefund, updateLoanRequest} from "../../../services/Api";
import {useParams} from "react-router-dom";
import Spinner from "../../../components/Spinner";
import {CButton, CCol, CRow} from "@coreui/react";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import {generateTablePdf} from "../../../services/pdf";
const ConfiguredSheet: React.FC = () => {
  const [data, setData] = useState({} as LoanRequest)
  const [trigger, setTrigger] = useState(false)
  const [current, setCurrent] = useState(0)
  const apiCall = findLoanRequest
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const userId = sessionStorage.getItem("userId")

  // pdf
  const pdfHead = ['Date', 'Reste à rembourser (Ar)', 'Montant à rembourser (Ar)', 'Intérêt (Ar)', 'Total à rembourser (Ar)', 'Statut']
  const buildPdf = () => {
    const body = data.refundTable?.map((row: LoanRefundPlan) => {
      return [
        format(new Date(row.monthyear!), 'MMMM yyyy', {locale: fr}),
        formatNumber(row.remainingAmount),
        formatNumber(row.amountToRefund),
        formatNumber(row.interestAmount),
        formatNumber(row.amountToRefund! + row.interestAmount!),
        row.refundState?.name
      ]
    })
    generateTablePdf(`Tableau de remboursement du pret ${id}`,`Refund-table-${new Date().getTime()}`,pdfHead,body)
  }

  const properties: SheetSectionProperties[] = [
    {
      label: "Id",
      type: SheetSectionType.text,
      selector: (data: LoanRequest) => data.id,
    },
    { label: "Client", type: SheetSectionType.text, selector: (data: LoanRequest) => data.user?.username },
    { label: 'Taux', type: SheetSectionType.text, selector: (data: LoanRequest) => formatNumber(data.interestRate?.rate!*100) + '%' },
    {
      label: 'Total',
      type: SheetSectionType.text,
      selector: (data: LoanRequest) => formatNumber(data.amount) + ' Ar',
    },
    {
      label: 'Date de demande',
      type: SheetSectionType.text,
      selector: (data: LoanRequest) => data.requestDate != null ? format(new Date(data.requestDate!), 'MMMM yyyy', {locale: fr}) : "",
    },
    {
      label: 'Tableau de remboursement',
      type: SheetSectionType.table,
      selector: (data: LoanRequest) => data.refundTable,
      table: {
        header:
        (
          <>
            <CCol xs={3}>
              <CButton
                onClick={(e) =>{buildPdf()}}>
                Exporter en PDF
              </CButton>
            </CCol>
          </>)
        ,
        columns: [
          {
            name: 'Date',
            selector: (data: LoanRefundPlan) => format(new Date(data.monthyear!), 'MMMM yyyy', {locale: fr}),
            sortable: false
          },
          {
            name: 'Reste à rembourser (Ar)',
            selector: (data: LoanRefundPlan) => formatNumber(data.remainingAmount),
            sortable: false
          },
          {
            name: 'Montant à rembourser (Ar)',
            selector: (data: LoanRefundPlan) => formatNumber(data.amountToRefund),
            sortable: false
          },
          {
            name: 'Intérêt (Ar)',
            selector: (data: LoanRefundPlan) => formatNumber(data.interestAmount),
            sortable: false
          },
          {
            name: 'Total à rembourser (Ar)',
            selector: (data: LoanRefundPlan) => formatNumber(data.amountToRefund! + data.interestAmount!),
            sortable: false
          },
          {
            name: 'Statut',
            selector: (data: LoanRefundPlan) => data.refundState?.name,
            sortable: false
          },
          {
            name: '',
            selector: (row: LoanRefundPlan) => (
              <>
              {row.refundState?.id === 1 && data.user?.id! == Number.parseInt(userId!) && row.id === current && (
                  <>
                    <CRow className="mb-2 mt-2">
                      <CCol>
                        <CButton color="success" onClick={() => {refund({...row,refundState: {id: 2}})}}>Rembourser</CButton>
                      </CCol>
                    </CRow>
                  </>
                )}
              </>
            ),
            sortable: false
          }
        ]
      },
    },
  ]
  const refund = (newData: LoanRefundPlan) => {
    newData = {...newData, loanRequest: {id: data.id}}
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
    updateLoanRefund(newData.id!, newData)
      .then((response) => {
        const swalData = {
          icon: "success" as SweetAlertIcon,
          title: "La demande a été mise à jour avec succès",
          timer: 1000,
          showConfirmButton: false
        };
        swal.close();
        swal.fire(swalData).then(() => {
          setTrigger(!trigger)
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

  const loadData = (id: number) => {
    findLoanRequest(id).then((data) => {
      let received = data.data as LoanRequest
      received.refundTable = received.refundTable?.sort((a, b) => a.monthyear! > b.monthyear! ? 1 : -1)
      const recent = received.refundTable?.find((value) => value.refundState?.id === 1)
      setCurrent(recent != undefined ? recent.id! : -1)
      setData(received)
    })
  }

  useEffect(() => {
    loadData(id)
  }, [])
  useEffect(() => {
    loadData(id)
  }, [trigger])
  return (
    <>
      {Object.keys(data).length === 0 ? (<Spinner/>) : (
        <Sheet
          title={`Fiche d'un pret`}
          data={data}
          editable={false}
          deletable={false}
          properties={properties}
        />
      )}
    </>
  )
}

export default ConfiguredSheet
