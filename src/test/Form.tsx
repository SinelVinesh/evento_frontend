import React, { useState } from "react";
import { FieldProperties } from "../common/types";
import { FieldType, ValidationType } from "../common/enums";
import Form from "../components/generic/Form";
import { sub } from "date-fns";

interface Person {
  firstName: string
  lastName: string
  birthDate: Date
}

const TestForm: React.FC = () => {
  const [person] = useState({} as Person)
  const properties: FieldProperties[] = [
    {
      label: 'Nom',
      name: 'name',
      type: FieldType.text,
      selector: (data) => data?.lastName,
      onChange: (e) => (person.lastName = e.target.value),
      validators: [{ validationType: ValidationType.required, feedback: 'Veuillez saisir un nom' }],
    },
    {
      label: 'Prénom',
      name: 'firstName',
      type: FieldType.text,
      selector: (data) => data?.firstName,
      onChange: (e) => (person.firstName = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: 'Veuillwz saisir un prénom' },
      ],
    },
    {
      label: 'Date de naissance',
      name: 'birthDate',
      type: FieldType.date,
      selector: (data) => data?.birthDate,
      onChange: (e) => (person.birthDate = e.target.value),
      validators: [
        { validationType: ValidationType.required, feedback: 'Veuillez saisir une date' },
        {
          validationType: ValidationType.dateInterval,
          feedback: 'La personne ajoutée doit etre majeur',
          args: { min: sub(Date.now(), { years: 18 }) },
        },
      ],
    },
  ]
  const submit = () => {
    alert(JSON.stringify(person))
  }

  return <Form data={person} properties={properties} submitFn={submit} submitText={'Enregistrer'} />
}

export default TestForm
