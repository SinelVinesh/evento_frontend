import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {filesUrl, findAllLocationType, getLocation, updateLocation, uploadFile} from "services/Api";
import {Location, LocationSeatCategory, LocationType} from "../../../common/appTypes";

const ConfiguredForm: React.FC = () => {
  const [data, setData] = useState({} as Location);
  const [locationTypesList, setLocationTypesList] = useState([] as LocationType[]);
  const [tempImage, setTempImage] = useState(undefined as any);
  const params = useParams();
  const id = params.id as string;
  const navigate = useNavigate();
  const apiInitialCall = getLocation;
  const apiSubmitCall = updateLocation;
  const redirectUrl = "/locations/list";
  const update = (swal: any, data: Location) => {
    apiSubmitCall(data)
      .then((response) => {
        const swalData = {
          icon: "success" as SweetAlertIcon,
          title: "Le lieu a été mis a jour avec succès",
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
        let reader = new FileReader();
        let url = reader.readAsDataURL(data.image);
        reader.onloadend = (e) => {
          setTempImage(reader.result);
        }
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
    findAllLocationType().then((response) => {
      setLocationTypesList(response.data.elements);
    })
    apiInitialCall(id).then((response) => {
      console.log(response.data)
      setTempImage(`${filesUrl}/${response.data.imageLink}`)
      setData(response.data)
    })
  }, [])
  return (
    <>
      {Object.keys(data).length === 0 ? <Spinner/> : (
        <Form
          title={"Mettre a jour un Lieu"}
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
