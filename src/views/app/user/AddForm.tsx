import React, {useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate} from "react-router-dom";
import {createUser} from "services/Api";
import {User} from "../../../common/appTypes";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as User);
  const navigate = useNavigate();
  const apiCall = createUser;
  const redirectUrl = "/users/list";
  const properties: FieldProperties[] = [
    {
      label: "Nom d'utilisateur",
      name: "username",
      type: FieldType.text,
      selector: (data) => data?.username,
      onChange: (e) => (data.username = e.target.value),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un nom d'utilisateur"}
      ]
    },
    {
      label: "Email",
      name: "email",
      type: FieldType.text,
      selector: (data) => data?.email,
      onChange: (e) => (data.email = e.target.value),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un email"}
      ]
    },
    {
      label: "Mot de passe",
      name: "password",
      type: FieldType.password,
      selector: (data) => data?.password,
      onChange: (e) => (data.password = e.target.value),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un mot de passe"},
      ]
    },
  ];
  const submit = () => {
    const swal = withReactContent(Swal);
    data.role = {id: 2}
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
          title: "L'utilisateur a été ajouté avec succès",
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
      title={"Ajouter un utilisateur"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
