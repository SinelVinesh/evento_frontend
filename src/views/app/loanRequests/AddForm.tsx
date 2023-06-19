import { InputAdornment } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoanDuration, LoanRequest, RefillRequest } from "../../../common/appTypes";
import { FieldType, ValidationType } from "../../../common/enums";
import { FieldProperties } from "../../../common/types";
import Spinner from "../../../components/Spinner";
import Form from "../../../components/generic/Form";
import { createLoanRequest, createRefillRequest, findAllLoanDuration } from "../../../services/Api";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as LoanRequest);
  const [loanDurationList, setLoanDurationList] = useState<LoanDuration[]>([]);
  const navigate = useNavigate();
  const apiCall = createLoanRequest;
  const redirectUrl = "/loan-requests/list";
  const properties: FieldProperties[] = [
    {
      label: "Date de la demande",
      name: "date",
      type: FieldType.datetime,
      selector: (data) => data?.requestDate,
      onChange: (e) => (data.requestDate = new Date(e.target.value).getTime()),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir une date" }
      ]
    },
    {
      label: "Montant",
      name: "amount",
      type: FieldType.number,
      selector: (data) => data?.amount,
      onChange: (e) => (data.amount = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir un montant" },
        { validationType: ValidationType.min, args: {value: 0}, feedback: "Le montant doit être positif" },
      ],
      inputProps: {
        startAdornment: <InputAdornment position="start">Ar</InputAdornment>
      }
    },
    {
      label: "Durée",
      name: "duration",
      type: FieldType.select,
      options: loanDurationList.map((duration) => ({ value: duration.id!, label: duration.duration!.toString() })),
      selector: (data) => data?.loanDuration?.id,
      onChange: (e) => (data.loanDuration = { id: e.target.value }),
    }
  ];
  const submit = () => {
    const swal = withReactContent(Swal);
    const loading = {
      title: "Ajout en cours...",
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
    apiCall(data)
      .then((response) => {
        const swalData = {
          icon: "success" as SweetAlertIcon,
          title: "Votre demande a été enregistrée avec succès",
          timer: 1000,
          showConfirmButton: false
        };
        swal.close();
        swal.fire(swalData).then(() => {
          navigate(redirectUrl);
        });
        console.log(response);
      })
      .catch((error) => {
        const swalData = {
          icon: "error" as SweetAlertIcon,
          title: "Une erreur est survenue lors de l'enregistrement",
          text: error.response.data.message
        };
        swal.fire(swalData);
        console.log(error);
      });
  };

  useEffect(() => {
    findAllLoanDuration().then((response) => {
      setLoanDurationList(response.data.elements);
    })
  }, []);
  return (
    <Form
      title={"Demande de pret"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
