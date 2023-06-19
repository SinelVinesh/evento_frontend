import React, {useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate} from "react-router-dom";
import {createMaterial} from "services/Api";
import {Material} from "../../../common/appTypes";
import {InputAdornment} from "@mui/material";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as Material);
  const navigate = useNavigate();
  const apiCall = createMaterial;
  const redirectUrl = "/materials/list";
  const properties: FieldProperties[] = [
    {
      label: "Nom",
      name: "name",
      type: FieldType.text,
      selector: (data) => data?.name,
      onChange: (e) => (data.name = e.target.value),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un nom"}
      ]
    },
    {
      label: "Prix de location",
      name: "rentPrice",
      type: FieldType.number,
      selector: (data) => data?.rentPrice,
      onChange: (e) => (data.rentPrice = e.target.value),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un prix de location"},
        {validationType: ValidationType.min, args: {value: 0}, feedback: "Le prix doit être positif"}
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
        <div style={{overflow: "hidden"}}>
          <Spinner/>
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
          title: "Le Matériel a été ajouté avec succès",
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
      title={"Ajouter un Matériel"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
