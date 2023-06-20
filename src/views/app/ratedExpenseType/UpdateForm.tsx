import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {findAllRateType, getRatedExpenseType, updateRatedExpenseType} from "services/Api";
import {RatedExpenseType, RateType} from "../../../common/appTypes";

const ConfiguredForm: React.FC = () => {
  const [data, setData] = useState({} as RatedExpenseType);
  const [rateTypeList, setRateTypeList] = useState([] as RateType[]);

  const params = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const apiInitialCall = getRatedExpenseType;
  const apiSubmitCall = updateRatedExpenseType;
  const redirectUrl = "/rated-expense-types/list";
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
      label: "Type de tarif",
      name: "ratedExpenseType",
      type: FieldType.select,
      options: rateTypeList.map((data) => ({value: data.id!, label: data.name!})),
      selector: (data) => data?.rateType?.id,
      onChange: (e) => (data.rateType = {id: e.target.value}),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez choisir un type de tarif"},
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
    findAllRateType().then((response) => {
      setRateTypeList(response.data.elements);
    });
    apiInitialCall(id).then((response) => {
      setData(response.data)
    })
  }, [])
  return (
    <>
      {Object.keys(data).length === 0 ? <Spinner/> : (
        <Form
          title={"Mettre a jour un type de dépense tarifé"}
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
