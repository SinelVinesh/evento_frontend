import React, { useEffect, useState } from "react";
import { FieldProperties } from "../../../common/types";
import { FieldType, ValidationType } from "../../../common/enums";
import { Client} from "../../../common/appTypes";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, { SweetAlertIcon } from "sweetalert2";
import Spinner from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { createClient } from "services/Api";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as Client);
  const navigate = useNavigate();
  const apiCall = createClient;
  const redirectUrl = "/clients/list";
  const properties: FieldProperties[] = [
    {
      label: "Nom d'utilisateur",
      name: "username",
      type: FieldType.text,
      selector: (data) => data?.username,
      onChange: (e) => (data.username = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir un nom d'utilisateur" }
      ]
    },
    {
      label: "Mot de passe",
      name: "password",
      type: FieldType.password,
      selector: (data) => data?.password,
      onChange: (e) => (data.password = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir un mot de passe" }
      ]
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
          title: "Le Client a été ajouté avec succès",
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
      title={"Ajouter un Client"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
