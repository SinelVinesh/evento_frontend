import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {filesUrl, getRatedExpense, updateRatedExpense, uploadFile} from "services/Api";
import {Location, RatedExpense} from "../../../common/appTypes";
import {InputAdornment} from "@mui/material";

const ConfiguredForm: React.FC = () => {
  const [data, setData] = useState({} as RatedExpense);
  const [tempImage, setTempImage] = useState(undefined as any);
  const params = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const apiInitialCall = getRatedExpense;
  const apiSubmitCall = updateRatedExpense;
  const redirectUrl = "/artists/list";
  const update = (swal: any, data: Location) => {
    apiSubmitCall(data)
      .then((response) => {
        const swalData = {
          icon: "success" as SweetAlertIcon,
          title: "L'artiste a été mis a jour avec succès",
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
      });
  }
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
        let reader = new FileReader();
        let url = reader.readAsDataURL(data.image);
        reader.onloadend = (e) => {
          setTempImage(reader.result);
        }
      },
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
    if (!tempImage.startsWith("http")) {
      const formData = new FormData();
      formData.append("file", data.image, data.image?.name);
      uploadFile(formData).then((response) => {
        data.imageLink = response.data
        update(swal, data)
      }).catch((error) => {
        const swalData = {
          icon: "error" as SweetAlertIcon,
          title: "Une erreur est survenue lors de l'enregistrement",
          text: error.response.data.message
        };
        swal.fire(swalData);
      })
    } else {
      update(swal, data)
    }
  };
  useEffect(() => {
    apiInitialCall(id).then((response) => {
      setTempImage(`${filesUrl}/${response.data.imageLink}`)
      setData(response.data)
    })
  }, [])
  return (
    <>
      {Object.keys(data).length === 0 ? <Spinner/> : (
        <Form
          title={"Mettre a jour un artiste"}
          data={data}
          properties={properties}
          submitFn={submit}
          submitText={"Enregistrer"}
          bodyTop={<img src={tempImage} style={{height: "220px"}}/>}
        />
      )}
    </>
  );
};

export default ConfiguredForm;
