import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate} from "react-router-dom";
import {createLocation, findAllLocationType, uploadFile,} from "services/Api";
import {Location, LocationSeatCategory, LocationType} from "../../../common/appTypes";

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
    {
      label: "Image",
      name: "file",
      type: FieldType.file,
      selector: (data) => data?.image?.name,
      onChange: (e) => {
        data.image = e.target.files[0];
      },
    },
    {
      label: "Nombre de places normales",
      name: "standardCapacity",
      type: FieldType.number,
      selector: (data) => data?.locationSeatCategories?.find((locationSeatCategory: LocationSeatCategory) => locationSeatCategory?.seatCategory?.id === 1)?.capacity,
      onChange: (e) => {
        if (!data.locationSeatCategories) {
          data.locationSeatCategories = []
        }
        const locationSeatCategory = data?.locationSeatCategories?.find((locationSeatCategory: LocationSeatCategory) => locationSeatCategory?.seatCategory?.id === 1);
        if (locationSeatCategory) {
          locationSeatCategory.capacity = e.target.value;
        } else {
          data.locationSeatCategories?.push({seatCategory: {id: 1}, capacity: e.target.value})
        }
      }
    },
    {
      label: "Nombre de places reservées",
      name: "reservationCapacity",
      type: FieldType.number,
      selector: (data) => data?.locationSeatCategories?.find((locationSeatCategory: LocationSeatCategory) => locationSeatCategory?.seatCategory?.id === 2)?.capacity,
      onChange: (e) => {
        if (!data.locationSeatCategories) {
          data.locationSeatCategories = []
        }
        const locationSeatCategory = data?.locationSeatCategories?.find((locationSeatCategory: LocationSeatCategory) => locationSeatCategory?.seatCategory?.id === 2);
        if (locationSeatCategory) {
          locationSeatCategory.capacity = e.target.value;
        } else {
          data.locationSeatCategories?.push({seatCategory: {id: 2}, capacity: e.target.value})
        }
      }
    },
    {
      label: "Nombre de places VIP",
      name: "vipCapacity",
      type: FieldType.number,
      selector: (data) => data?.locationSeatCategories?.find((locationSeatCategory: LocationSeatCategory) => locationSeatCategory?.seatCategory?.id === 3)?.capacity,
      onChange: (e) => {
        if (!data.locationSeatCategories) {
          data.locationSeatCategories = []
        }
        const locationSeatCategory = data?.locationSeatCategories?.find((locationSeatCategory: LocationSeatCategory) => locationSeatCategory?.seatCategory?.id === 3);
        if (locationSeatCategory) {
          locationSeatCategory.capacity = e.target.value;
        } else {
          data.locationSeatCategories?.push({seatCategory: {id: 3}, capacity: e.target.value})
        }
      }
    },
  ];
  const submit = () => {
    const swal = withReactContent(Swal);
    console.log(data)
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
