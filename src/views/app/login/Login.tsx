import React, { useState } from "react";
import { CCardGroup, CCol, CContainer, CRow } from "@coreui/react";
import { AuthRequest } from "../../../common/appTypes";
import { FieldProperties } from "../../../common/types";
import { FieldType, ValidationType } from "../../../common/enums";
import Form from "../../../components/generic/Form";
import { login } from "../../../services/Api";
import withReactContent from "sweetalert2-react-content";
import Swal, { SweetAlertIcon } from "sweetalert2";
import Spinner from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";

interface LoginError {
  username?: string;
  password?: string;
}

const Login = () => {
  const [authRequest] = useState({} as AuthRequest);
  const navigate = useNavigate();
  const properties: FieldProperties[] = [
    {
      label: "Nom d'utilisateur",
      name: "username",
      type: FieldType.text,
      selector: (data) => data?.username,
      onChange: (e) => (authRequest.username = e.target.value),
      validators: [
        {
          validationType: ValidationType.required,
          feedback: "Veuillez saisir un nom d'utilisateur"
        }
      ]
    },
    {
      label: "Mot de passe",
      name: "password",
      type: FieldType.password,
      selector: (data) => data?.password,
      onChange: (e) => (authRequest.password = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: "Veuillez saisir un mot de passe" }
      ]
    }
  ];
  const submit = () => {
    const swal = withReactContent(Swal);
    const loading = {
      title: "Connexion en cours...",
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
    login(authRequest)
      .then((response) => {
        sessionStorage.setItem("token", response.access_token);
        sessionStorage.setItem("storeId", response.storeId);
        sessionStorage.setItem("userId", response.userId);
        sessionStorage.setItem("username", response.username);
        sessionStorage.setItem("role", JSON.stringify(response.role))
        const home = response.role.id === 1 ? "/dashboard" : "/loans/list";
        const swalData = {
          icon: "success" as SweetAlertIcon,
          title: "Connexion réussie",
          timer: 1000,
          showConfirmButton: false
        };
        swal.close();
        swal.fire(swalData).then(() => {
          navigate(home);
        });
        console.log(response);
      })
      .catch((error) => {
        const swalData = {
          icon: "error" as SweetAlertIcon,
          title: "Une erreur est survenue lors de la connexion",
          text: error.response.data.message
        };
        swal.fire(swalData);
        console.log(error);
      });
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer className="restricted-width-720">
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <Form
                bodyTop={<h1>Connexion</h1>}
                data={authRequest}
                properties={properties}
                submitFn={submit}
                submitText={"Se connecter"}
              />
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
