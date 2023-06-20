import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {getUser, updateUser} from "services/Api";
import {User} from "../../../common/appTypes";

const ConfiguredForm: React.FC = () => {
  const [data, setData] = useState({} as User);

  const params = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const apiInitialCall = getUser;
  const apiSubmitCall = updateUser;
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
    apiSubmitCall(data)
      .then((response) => {
        const swalData = {
          icon: "success" as SweetAlertIcon,
          title: "L'utilisateur a été mis a jour avec succès",
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
          title: "Une erreur est survenue lors de la mise a jour",
          text: error.response.data.message
        };
        swal.fire(swalData);
        console.log(error);
      });
  };
  useEffect(() => {
    apiInitialCall(id).then((response) => {
      console.log(response.data)
      setData(response.data)
    })
  }, [])
  return (
    <>
      {Object.keys(data).length === 0 ? <Spinner/> : (
        <Form
          title={"Mettre a jour un utilisateur"}
          data={data}
          properties={properties}
          submitFn={submit}
          submitText={"Enregistrer"}
        />
      )}
    </>
  );
};

export default ConfiguredForm;
