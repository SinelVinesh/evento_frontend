import { InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoanDuration } from "../../../../common/appTypes";
import { FieldType, ValidationType } from "../../../../common/enums";
import { FieldProperties } from "../../../../common/types";
import Spinner from "../../../../components/Spinner";
import Form from "../../../../components/generic/Form";
import { createLoanDuration } from "../../../../services/Api";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as LoanDuration);
  const navigate = useNavigate();
  const apiCall = createLoanDuration;
  const redirectUrl = "/settings/loan-durations/list";
  const properties: FieldProperties[] = [
    {
      label: "Durée",
      name: "duration",
      type: FieldType.number,
      selector: (data) => data?.duration,
      onChange: (e) => (data.duration = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir une durée" }
      ],
      inputProps: {
        endAdornment: <InputAdornment position="end">Mois</InputAdornment>
      }
    },
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
          title: "La durée d'emprunt a été ajoutée avec succès",
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
  return (
    <Form
      title={"Ajouter une durée d'emprunt"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
