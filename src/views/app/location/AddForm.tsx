import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate} from "react-router-dom";
import {createLocation, findAllLocationType} from "services/Api";
import {Location, LocationType} from "../../../common/appTypes";
import {InputAdornment} from "@mui/material";

const ConfiguredForm: React.FC = () => {
  const [data] = useState({} as Location);
  const [locationTypesList, setLocationTypesList] = useState([] as LocationType[]);
  const navigate = useNavigate();
  const apiCall = createLocation;
  const redirectUrl = "/locations/list";
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
      label: "Nombre de place",
      name: "maxCapacity",
      type: FieldType.number,
      selector: (data) => data?.maxCapacity,
      onChange: (e) => (data.maxCapacity = e.target.value),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir le nombre de place"},
        {validationType: ValidationType.min, args: {value: 0}, feedback: "Le nombre de place doit être positif"}
      ],
      inputProps: {
        endAdornment: <InputAdornment position="end">Ar</InputAdornment>
      }
    },
    {
      label: "Type de lieu",
      name: "locationType",
      type: FieldType.select,
      options: locationTypesList.map((locationType) => ({value: locationType.id!, label: locationType.name!})),
      selector: (data) => data?.locationType?.id,
      onChange: (e) => (data.locationType = {id: e.target.value}),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez choisir un type de lieu"},
      ],
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
          title: "Le Lieu a été ajouté avec succès",
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
    findAllLocationType().then((response) => {
      setLocationTypesList(response.data.elements);
    })
  }, [])
  return (
    <Form
      title={"Ajouter un Lieu"}
      data={data}
      properties={properties}
      submitFn={submit}
      submitText={"Enregistrer"}
    />
  );
};

export default ConfiguredForm;
