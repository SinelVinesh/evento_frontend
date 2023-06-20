import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {findAllRatedExpenseType, getRatedExpense, updateRatedExpense} from "services/Api";
import {RatedExpense, RatedExpenseType} from "../../../common/appTypes";
import {InputAdornment} from "@mui/material";

const ConfiguredForm: React.FC = () => {
  const [data, setData] = useState({} as RatedExpense);
  const [ratedExpenseTypesList, setRatedExpenseTypesList] = useState([] as RatedExpenseType[]);

  const params = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const apiInitialCall = getRatedExpense;
  const apiSubmitCall = updateRatedExpense;
  const redirectUrl = "/rated-expenses/list";
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
    }, {
      label: "Catégorie",
      name: "ratedExpenseType",
      type: FieldType.select,
      options: ratedExpenseTypesList.map((ratedExpenseType) => ({
        value: ratedExpenseType.id!,
        label: `${ratedExpenseType.name!} (${ratedExpenseType.rateType!.name!})`
      })),
      selector: (data) => data?.ratedExpenseType?.id,
      onChange: (e) => (data.ratedExpenseType = {id: e.target.value}),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez choisir une catégorie"}
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
    }
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
    findAllRatedExpenseType().then((response) => {
      const data = response.data.elements.filter((ratedExpenseType: RatedExpenseType) => ratedExpenseType.id !== 1);
      setRatedExpenseTypesList(data);
    })
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
