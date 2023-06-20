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
  EventType,
  EventVariableExpense,
  Location,
  LocationSeatCategory,
  RatedExpense,
  VariableExpense
} from "../../../common/appTypes";
import {
  findAllEventType,
  findAllLocation,
  findAllRatedExpense,
  findAllVariableExpense,
  getEvent,
  updateEvent
} from "../../../services/Api";
import {InputAdornment} from "@mui/material";
import {CButton, CCol, CRow} from "@coreui/react";
import {Delete} from "@mui/icons-material";
import {formatNumber} from "../../../services/Format";
import {format} from "date-fns";

const ConfiguredForm: React.FC = () => {
  const [data, setData] = useState({} as Event);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [eventTypeList, setEventTypeList] = useState<EventType[]>([]);

  const [ratedExpenseList, setRatedExpenseList] = useState<RatedExpense[]>([]);
  const [eventRatedExpense, setEventRatedExpense] = useState({} as EventRatedExpense);
  const [eventRatedExpenses, setEventRatedExpenses] = useState<EventRatedExpense[]>([]);
  const [ratedFakeId, setRatedFakeId] = useState(0);
  const [selectedEventRatedExpenses, setSelectedEventRatedExpenses] = useState<EventRatedExpense[]>([]);

  const [variableExpenseList, setVariableExpenseList] = useState<VariableExpense[]>([]);
  const [eventVariableExpense, setEventVariableExpense] = useState({} as EventVariableExpense);
  const [eventVariableExpenses, setEventVariableExpenses] = useState<EventVariableExpense[]>([]);
  const [variableFakeId, setVariableFakeId] = useState(0);
  const [selectedEventVariableExpenses, setSelectedEventVariableExpenses] = useState<EventVariableExpense[]>([]);

  const [seatCategoryPrices, setSeatCategoryPrices] = useState([] as any[])
  const [locationSeatCategories, setLocationSeatCategories] = useState([] as LocationSeatCategory[])

  const params = useParams();
  const id = Number.parseInt(params.id as string);
  const navigate = useNavigate();
  const apiSubmitCall = updateEvent;
  const apiInitialCall = getEvent;
  const redirectUrl = "/events/list";
  const deleteButton = React.useMemo(() => {
    const handleDelete = () => {
      setEventRatedExpenses(
        eventRatedExpenses.filter(
          (detail) => selectedEventRatedExpenses.find((row) => row.id === detail.id) === undefined
        )
      );
    };
    return (
      <CButton key={"delete"} onClick={handleDelete} color={"danger"}>
        <Delete/>
      </CButton>
    );
  }, [eventRatedExpenses, selectedEventRatedExpenses]);
  const deleteButtonVariable = React.useMemo(() => {
    const handleDelete = () => {
      setEventVariableExpenses(
        eventVariableExpenses.filter(
          (detail) => selectedEventVariableExpenses.find((row) => row.id === detail.id) === undefined
        )
      );
    };
    return (
      <CButton key={"delete"} onClick={handleDelete} color={"danger"}>
        <Delete/>
      </CButton>
    );
  }, [eventVariableExpenses, selectedEventVariableExpenses]);
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
      label: "Type d'évènement",
      name: "eventType",
      type: FieldType.select,
      options: eventTypeList.map((eventType) => ({value: eventType.id!, label: eventType.name!})),
      selector: (data) => data?.eventType?.id,
      onChange: (e) => (data.eventType = {id: e.target.value}),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez choisir un type d'évènement"}
      ]
    },
    {
      label: "Lieu",
      name: "location",
      type: FieldType.select,
      options: locationList.map((eventType) => ({value: eventType.id!, label: eventType.name!})),
      selector: (data) => data?.location?.id,
      onChange: (e) => (data.location = {id: e.target.value}),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez choisir un lieu"}
      ]
    },
    {
      label: "Prix de location",
      name: "location_price",
      type: FieldType.number,
      selector: (data) => data?.locationPrice,
      onChange: (e) => (setData({...data, locationPrice: e.target.value})),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un prix de location"},
        {validationType: ValidationType.min, args: {value: 0}, feedback: "Le prix de location doit être supérieur à 0"}
      ],
      inputProps: {
        startAdornment: <InputAdornment position="start">Ar</InputAdornment>
      }
    },
    {
      label: "Date de début",
      name: "startDate",
      type: FieldType.datetime,
      selector: (data) => format(new Date(data?.startDate), "yyyy-MM-dd'T'HH:mm"),
      onChange: (e) => (data.startDate = new Date(e.target.value).getTime()),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir une date"},
        {
          validationType: ValidationType.dateAfter,
          args: {date: Date.now()},
          feedback: "La date de début doit être supérieur à la date d'aujourd'hui"
        }
      ],
    },
    {
      label: "Date de fin",
      name: "endDate",
      type: FieldType.datetime,
      selector: (data) => format(new Date(data?.endDate), "yyyy-MM-dd'T'HH:mm"),
      onChange: (e) => (data.endDate = new Date(e.target.value).getTime()),
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir une date"},
      ],
    },
    {
      label: "Dépenses tarifées",
      name: "ratedExpenses",
      selector: (data) => eventRatedExpense,
      onChange: (e) => {
      },
      type: FieldType.multiple,
      multiple: {
        bodyTop: <>
          <h4>Dépenses tarifées</h4>
          <div>
            <b>Total dépenses tarifées
              :</b> {formatNumber(eventRatedExpenses.reduce((acc, cur) => acc + cur?.duration! * cur.ratedExpense?.rentPrice! * cur.quantity!, 0))} Ar
          </div>
        </>,
        multipleEntriesOption: {
          entries: eventRatedExpenses,
          addFn: () => {
            setEventRatedExpenses([...eventRatedExpenses, {
              ...eventRatedExpense,
              id: ratedFakeId
            } as EventRatedExpense]);
            setRatedFakeId(ratedFakeId + 1);
          },
          multipleSelectionHandler: ({selectedRows}: any) => {
            setSelectedEventRatedExpenses(selectedRows);
          },
          contextActions: deleteButton
        },
        data: eventRatedExpense,
        multipleData: eventRatedExpenses,
        properties: [
          {
            label: "Dépense tarifée",
            name: "ratedExpense",
            type: FieldType.select,
            options: ratedExpenseList.map((ratedExpense) => ({
              value: ratedExpense.id!,
              label: `${ratedExpense.name!} (Tarif ${ratedExpense?.ratedExpenseType?.rateType?.name!})`
            })),
            selector: (data: any) => data?.ratedExpense?.id,
            alternativeSelector: (data: any) => `${data?.ratedExpense?.name} (Tarif ${data?.ratedExpense?.ratedExpenseType?.rateType?.name})`,
            onChange: (e: any) => (eventRatedExpense.ratedExpense = {
              id: e.target.value,
              name: ratedExpenseList.find((ratedExpense) => ratedExpense.id === e.target.value)?.name,
              ratedExpenseType: ratedExpenseList.find((ratedExpense) => ratedExpense.id === e.target.value)?.ratedExpenseType,
              rentPrice: ratedExpenseList.find((ratedExpense) => ratedExpense.id === e.target.value)?.rentPrice
            }),
          },
          {
            label: "Durée",
            name: "duration",
            type: FieldType.number,
            selector: (data: any) => data?.duration,
            onChange: (e: any) => (eventRatedExpense.duration = e.target.value),
          },
          {
            label: "Quantité",
            name: "quantity",
            type: FieldType.number,
            selector: (data: any) => data?.quantity,
            onChange: (e: any) => (eventRatedExpense.quantity = e.target.value),
          },
          {
            label: "Prix unitaire (Ar)",
            name: "unitPrice",
            type: FieldType.hidden,
            selector: (data: any) => formatNumber(data?.ratedExpense?.rentPrice),
          },
          {
            label: "Prix total (Ar)",
            name: "totalPrice",
            type: FieldType.hidden,
            selector: (data: any) => formatNumber(data?.ratedExpense?.rentPrice * data?.duration * data?.quantity),
          }
        ]
      },

    },
    {
      label: "Autres dépenses",
      name: "variableExpenses",
      selector: (data) => eventVariableExpense,
      onChange: (e) => {
      },
      type: FieldType.multiple,
      multiple: {
        bodyTop: <>
          <h4>Autres Dépenses</h4>
          <div>
            <b>Total des autres dépenses
              :</b> {formatNumber(eventVariableExpenses.reduce((acc, cur) => acc + Number.parseInt(String(cur?.amount!)) * cur?.quantity, 0))} Ar
          </div>
        </>,
        multipleEntriesOption: {
          entries: eventVariableExpenses,
          addFn: () => {
            setEventVariableExpenses([...eventVariableExpenses, {
              ...eventVariableExpense,
              id: variableFakeId
            } as EventVariableExpense]);
            setVariableFakeId(variableFakeId + 1);
          },
          multipleSelectionHandler: ({selectedRows}: any) => {
            setSelectedEventVariableExpenses(selectedRows);
          },
          contextActions: deleteButtonVariable
        },
        data: eventVariableExpense,
        multipleData: eventVariableExpenses,
        properties: [
          {
            label: "Autre dépense",
            name: "variableExpense",
            type: FieldType.select,
            options: variableExpenseList.map((variableExpense) => ({
              value: variableExpense.id!,
              label: `${variableExpense.name!}`
            })),
            selector: (data: any) => data?.variableExpense?.id,
            alternativeSelector: (data: any) => `${data?.variableExpense?.name}`,
            onChange: (e: any) => (eventVariableExpense.variableExpense = {
              id: e.target.value,
              name: variableExpenseList.find((variableExpense) => variableExpense.id === e.target.value)?.name,
            })
          },
          {
            label: "Quantité",
            name: "quantity",
            type: FieldType.number,
            selector: (data: any) => data?.quantity,
            onChange: (e: any) => (eventVariableExpense.quantity = e.target.value),
          },
          {
            label: "Prix (Ar)",
            name: "amount",
            type: FieldType.number,
            selector: (data: any) => data?.amount * data?.quantity,
            onChange: (e: any) => (eventVariableExpense.amount = e.target.value),
            inputProps: {
              startAdornment: <InputAdornment position="start">Ar</InputAdornment>
            }
          }
        ]
      },

    },
    {
      label: "Prix place normal",
      name: "normalprice",
      type: FieldType.number,
      selector: (data) => seatCategoryPrices?.find((price: any) => price?.seatCategory?.id === 1)?.price,
      onChange: (e) => {
        const prices = [...seatCategoryPrices]
        const eventSeatCategory = prices?.find((price: any) => price?.seatCategory?.id === 1)
        if (eventSeatCategory) {
          eventSeatCategory.price = e.target.value
        } else {
          prices.push({seatCategory: {id: 1}, price: e.target.value})
        }
        setSeatCategoryPrices(prices)
      },
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un prix pour les places normales"},
      ],
    },
    {
      label: "Prix place reservé",
      name: "reservationprice",
      type: FieldType.number,
      selector: (data) => seatCategoryPrices?.find((price: any) => price?.seatCategory?.id === 2)?.price,
      onChange: (e) => {
        const prices = [...seatCategoryPrices]
        const eventSeatCategory = prices?.find((price: any) => price?.seatCategory.id === 2)
        if (eventSeatCategory) {
          eventSeatCategory.price = e.target.value
        } else {
          prices.push({seatCategory: {id: 2}, price: e.target.value})
        }
        setSeatCategoryPrices(prices)
      },
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un prix pour les places reservées"},
      ],
    },
    {
      label: "Prix place VIP",
      name: "vipprice",
      type: FieldType.number,
      selector: (data) => seatCategoryPrices?.find((price: any) => price?.seatCategory?.id === 3)?.price,
      onChange: (e) => {
        const prices = [...seatCategoryPrices]
        const eventSeatCategory = prices?.find((price: any) => price?.seatCategory?.id === 3)
        if (eventSeatCategory) {
          eventSeatCategory.price = e.target.value
        } else {
          prices.push({seatCategory: {id: 3}, price: e.target.value})
        }
        setSeatCategoryPrices(prices)
      },
      validators: [
        {validationType: ValidationType.required, feedback: "Veuillez saisir un prix pour les places VIP"},
      ],
    },
  ];
  const submit = () => {
    data.ratedExpenses = eventRatedExpenses;
    data.variableExpenses = eventVariableExpenses;
    data.eventSeatCategories = []
    for (const price of seatCategoryPrices) {
      const locationSeatCategory = locationSeatCategories?.find((category: LocationSeatCategory) => category?.seatCategory?.id == price.seatCategory.id)
      const eventSeatCategory = {locationSeatCategory: locationSeatCategory, price: price.price}
      data.eventSeatCategories.push(eventSeatCategory)
    }
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
          title: "L'évènement a été mis a jour avec succès",
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
    findAllRatedExpense().then((response) => {
      setRatedExpenseList(response.data.elements);
    });
    findAllEventType().then((response) => {
      setEventTypeList(response.data.elements);
    });
    findAllLocation().then((response) => {
      setLocationList(response.data.elements);
    });
    findAllVariableExpense().then((response) => {
      setVariableExpenseList(response.data.elements);
    });
    apiInitialCall(id).then((response) => {
      let initialData = response.data;
      initialData.startDate = new Date(initialData.startDate).getTime();
      initialData.endDate = new Date(initialData.endDate).getTime();
      let ratedTempFake = ratedFakeId;
      for (const expense of initialData.ratedExpenses) {
        expense.id = ratedTempFake;
        ratedTempFake++;
      }
      let variableTempFake = variableFakeId;
      for (const expense of initialData.variableExpenses) {
        expense.id = variableTempFake;
        variableTempFake++;
      }
      const locationSeatCategories = initialData.location.locationSeatCategories
      const seatCategoryPrices = []
      for (const eventSeatCategory of initialData.eventSeatCategories) {
        seatCategoryPrices.push({
          seatCategory: eventSeatCategory.locationSeatCategory.seatCategory,
          price: eventSeatCategory.price
        })
      }
      setLocationSeatCategories(locationSeatCategories)
      setSeatCategoryPrices(seatCategoryPrices)
      setRatedFakeId(ratedTempFake);
      setVariableFakeId(variableTempFake);
      setEventRatedExpenses(initialData.ratedExpenses);
      setEventVariableExpenses(initialData.variableExpenses);
      setData(initialData);
    });
  }, [])
  return (
    <>
      {Object.keys(data).length > 0 && Object.keys(locationList).length > 0 && (
        <Form
          title={"Modifier un évènement"}
          data={data}
          properties={properties}
          submitFn={submit}
          submitText={"Enregistrer"}
          initialSubmitAllowed={true}
          formBottom={<>
            <CRow>
              <CCol>
                <b>Estimation du devis :</b> {

                formatNumber(
                  eventRatedExpenses.reduce((acc, cur) => acc + Number.parseInt(String(cur?.duration! * cur?.ratedExpense?.rentPrice!)), 0)
                  + eventVariableExpenses.reduce((acc, cur) => acc + Number.parseInt(String(cur?.amount === undefined ? 0 : cur?.amount)), 0)
                  + (data.locationPrice === undefined ? 0 : Number.parseInt(String(data.locationPrice))))} Ar
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <b>Estimation de la recette : </b>
                {
                  formatNumber(
                    seatCategoryPrices.reduce((acc, cur) => acc + (locationSeatCategories?.find((category: LocationSeatCategory) => category?.seatCategory?.id == cur.seatCategory.id)?.capacity ?? 0) * cur.price, 0)
                  )
                }
                Ar

              </CCol>
            </CRow>
          </>}
        />
      )}
    </>
  );
};

export default ConfiguredForm;
