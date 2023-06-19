import { InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AmountBounds } from "../../../../common/appTypes";
import { FieldType, ValidationType } from "../../../../common/enums";
import { FieldProperties } from "../../../../common/types";
import Spinner from "../../../../components/Spinner";
import Form from "../../../../components/generic/Form";
import { createAmountBounds } from "../../../../services/Api";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as AmountBounds);
  const navigate = useNavigate();
  const apiCall = createAmountBounds;
  const redirectUrl = "/settings/amount-bounds/history";
  const properties: FieldProperties[] = [
    {
      label: "Date",
      name: "date",
      type: FieldType.datetime,
      selector: (data) => data?.date,
      onChange: (e) => (data.date = new Date(e.target.value).getTime()),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir une date" }
      ]
    },
    {
      label: "Montant maximum",
      name: "maxAmount",
      type: FieldType.number,
      selector: (data) => data?.maxAmount,
      onChange: (e) => (data.maxAmount = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir un montant maximum" }
      ],
      inputProps: {
        startAdornment: <InputAdornment position="start">Ar</InputAdornment>
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
          title: "Le montant maximum a été changé avec succès",
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
      title={"Modifier le montant maximum d'un pret"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
