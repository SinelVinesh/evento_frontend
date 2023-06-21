import React, {useEffect, useState} from "react";
import {FieldProperties} from "../../../common/types";
import {FieldType, ValidationType} from "../../../common/enums";
import Form from "../../../components/generic/Form";
import withReactContent from "sweetalert2-react-content";
import Swal, {SweetAlertIcon} from "sweetalert2";
import Spinner from "../../../components/Spinner";
import {useNavigate, useParams} from "react-router-dom";
import {
  Event,
  EventRatedExpense,
  EventVariableExpense,
  Location,
  LocationSeatCategory,
  Setting
} from "../../../common/appTypes";
import {findAllLocation, getEvent, getSetting, updateEvent} from "../../../services/Api";

const ConfiguredForm: React.FC = () => {
  const [data, setData] = useState({} as Event);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [taxe, setTaxe] = useState({} as Setting);

  const [eventRatedExpenses, setEventRatedExpenses] = useState<EventRatedExpense[]>([]);
  const [selectedEventRatedExpenses, setSelectedEventRatedExpenses] = useState<EventRatedExpense[]>([]);

  const [eventVariableExpenses, setEventVariableExpenses] = useState<EventVariableExpense[]>([]);
  const [selectedEventVariableExpenses, setSelectedEventVariableExpenses] = useState<EventVariableExpense[]>([]);

  const [seatCategoryPrices, setSeatCategoryPrices] = useState([] as any[])
  const [locationSeatCategories, setLocationSeatCategories] = useState([] as LocationSeatCategory[])

  const params = useParams();
  const id = Number.parseInt(params.id as string);
  const navigate = useNavigate();
  const apiSubmitCall = updateEvent;
  const apiInitialCall = getEvent;
  const redirectUrl = "/events/list";
  const properties: FieldProperties[] = [
    {
      label: "Id",
      name: "id",
      type: FieldType.disabled,
      selector: (data) => data?.id,
      onChange: (e) => null,
    },
    {
      label: "Nom",
      name: "name",
      type: FieldType.disabled,
      selector: (data) => data?.name,
      onChange: (e) => null,
    },
    {
      label: "Lieu",
      name: "location",
      type: FieldType.disabled,
      selector: (data) => data?.location?.name,
      onChange: (e) => null,
    },
    {
      label: `ventes de places normales : ${data.eventSeatCategories?.find((eventSeatCategory) => eventSeatCategory?.locationSeatCategory?.seatCategory?.id === 1)?.locationSeatCategory?.capacity} places disponibles`,
      name: "normalsales",
      type: FieldType.number,
      selector: (data) => seatCategoryPrices?.find((price: any) => price?.seatCategory?.id === 1)?.sales,
      onChange: (e) => {
        const prices = [...seatCategoryPrices]
        const eventSeatCategory = prices?.find((price: any) => price?.seatCategory?.id === 1)
        eventSeatCategory.sales = e.target.value
        setSeatCategoryPrices(prices)
      },
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir le nombre de places normales vendu"},
      ],
    },
    {
      label: `ventes de places reservées : ${data.eventSeatCategories?.find((eventSeatCategory) => eventSeatCategory?.locationSeatCategory?.seatCategory?.id === 2)?.locationSeatCategory?.capacity} places disponibles`,
      name: "reservationsales",
      type: FieldType.number,
      selector: (data) => seatCategoryPrices?.find((price: any) => price?.seatCategory?.id === 2)?.sales,
      onChange: (e) => {
        const prices = [...seatCategoryPrices]
        const eventSeatCategory = prices?.find((price: any) => price?.seatCategory?.id === 2)
        eventSeatCategory.sales = e.target.value
        setSeatCategoryPrices(prices)
      },
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir le nombre de places réservées vendu"},
      ],
    },
    {
      label: `ventes de places VIP : ${data.eventSeatCategories?.find((eventSeatCategory) => eventSeatCategory?.locationSeatCategory?.seatCategory?.id === 3)?.locationSeatCategory?.capacity} places disponibles`,
      name: "vipsales",
      type: FieldType.number,
      selector: (data) => seatCategoryPrices?.find((price: any) => price?.seatCategory?.id === 3)?.sales,
      onChange: (e) => {
        const prices = [...seatCategoryPrices]
        const eventSeatCategory = prices?.find((price: any) => price?.seatCategory?.id === 3)
        eventSeatCategory.sales = e.target.value
        setSeatCategoryPrices(prices)
      },
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir le nombre de places VIP vendu"},
      ],
    },
  ];
  const submit = () => {
    for (const price of seatCategoryPrices) {
      const eventSeatCategory = data.eventSeatCategories?.find((eventSeatCategory) => eventSeatCategory?.locationSeatCategory?.seatCategory?.id === price.seatCategory.id)!
      eventSeatCategory.sales = price.sales
    }
    data.taxe = taxe.value
    console.log(data);
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
          title: "La vente des billets a été enregistrée",
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
          title: "Une erreur est survenue lors de la mis a jour",
          text: error.response.data.message
        };
        swal.fire(swalData);
        console.log(error);
      });
  };
  useEffect(() => {
    findAllLocation().then((response) => {
      setLocationList(response.data.elements);
    });
    getSetting("1").then((response) => {
      setTaxe(response.data);
    })
    apiInitialCall(id).then((response) => {
      let initialData = response.data;
      initialData.startDate = new Date(initialData.startDate).getTime();
      initialData.endDate = new Date(initialData.endDate).getTime();
      const seatCategoryPrices = []
      for (const eventSeatCategory of initialData.eventSeatCategories) {
        seatCategoryPrices.push({
          seatCategory: eventSeatCategory.locationSeatCategory.seatCategory,
          sales: eventSeatCategory.sales
        })
      }
      setLocationSeatCategories(locationSeatCategories)
      setSeatCategoryPrices(seatCategoryPrices)
      setData(initialData);
    });
  }, [])
  return (
    <>
      {Object.keys(data).length > 0 && Object.keys(locationList).length > 0 && (
        <Form
          title={"Enregistrement des ventes"}
          data={data}
          properties={properties}
          submitFn={submit}
          submitText={"Enregistrer"}
          initialSubmitAllowed={true}
        />
      )}
    </>
  );
};

export default ConfiguredForm;
