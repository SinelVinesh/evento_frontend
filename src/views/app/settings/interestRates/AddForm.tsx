import { InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { InterestRate } from "../../../../common/appTypes";
import { FieldType, ValidationType } from "../../../../common/enums";
import { FieldProperties } from "../../../../common/types";
import Spinner from "../../../../components/Spinner";
import Form from "../../../../components/generic/Form";
import { createInterestRate } from "../../../../services/Api";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as InterestRate);
  const navigate = useNavigate();
  const apiCall = createInterestRate;
  const redirectUrl = "/settings/interest-rates/history";
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
      label: "Taux d'intérêt",
      name: "rate",
      type: FieldType.number,
      selector: (data) => data?.rate,
      onChange: (e) => (data.rate = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir un taux d'intérêt" },
        { validationType: ValidationType.min, args: {value: 0}, feedback: "Le taux d'intérêt doit être positif" },
        { validationType: ValidationType.max, args: {value: 99}, feedback: "Le taux d'intérêt doit être inférieur à 100" }
      ],
      inputProps: {
        startAdornment: <InputAdornment position="start">%</InputAdornment>
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
          title: "Le taux d'intérêt a été changé avec succès",
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
      title={"Modifier du taux d'intérêt"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
