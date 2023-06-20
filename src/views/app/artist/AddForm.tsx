import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate} from "react-router-dom";
import {createRatedExpense, findAllRatedExpenseType, uploadFile} from "services/Api";
import {RatedExpense, RatedExpenseType} from "../../../common/appTypes";
import {InputAdornment} from "@mui/material";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as RatedExpense);
  const [ratedExpenseTypesList, setRatedExpenseTypesList] = useState([] as RatedExpenseType[]);
  const navigate = useNavigate();
  const apiCall = createRatedExpense;
  const redirectUrl = "/artists/list";
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
      label: "Tarif",
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
    {
      label: "Image",
      name: "file",
      type: FieldType.file,
      selector: (data) => data?.image?.name,
      onChange: (e) => {
        data.image = e.target.files[0];
      },
    }
  ];
  const submit = () => {
    data.ratedExpenseType = {id: 1}
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
    const formData = new FormData();
    formData.append("file", data.image, data.image?.name);
    uploadFile(formData).then((response) => {
      data.imageLink = response.data
      apiCall(data)
        .then((response) => {
          const swalData = {
            icon: "success" as SweetAlertIcon,
            title: "L'artiste a été ajouté avec succès",
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
    }).catch((error) => {
      const swalData = {
        icon: "error" as SweetAlertIcon,
        title: "Une erreur est survenue lors de l'enregistrement",
        text: error.response.data.message
      };
      swal.fire(swalData);
      console.log(error);
    })
  };
  useEffect(() => {
    findAllRatedExpenseType().then((response) => {
      setRatedExpenseTypesList(response.data.elements);
    })
  }, [])
  return (
    <Form
      title={"Ajouter un artiste"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
