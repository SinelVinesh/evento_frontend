import Sheet from "components/generic/Sheet";
import React, { useEffect, useState } from "react";
import avatar from "../assets/images/avatars/1.jpg";
import { SheetSectionProperties } from "../common/types";
import { SheetSectionType } from "../common/enums";

interface Person {
  image: any
  firstName: string
  lastName: string
  birthDate: Date
}
const SheetTest: React.FC = () => {
  const [person, setPerson] = useState({} as Person)
  const properties: SheetSectionProperties[] = [
    {
      label: "Photo d'identité",
      type: SheetSectionType.image,
      selector: (person: Person) => person.image,
    },
    { label: 'Nom', type: SheetSectionType.text, selector: (person: Person) => person.lastName },
    {
      label: 'Prénom',
      type: SheetSectionType.text,
      selector: (person: Person) => person.firstName,
    },
    {
      label: 'Date de naissance',
      type: SheetSectionType.text,
      selector: (person: Person) => person.birthDate?.toLocaleDateString(),
    },
  ]
  useEffect(() => {
    setPerson({
      image: avatar,
      firstName: 'Jeanne',
      lastName: 'Rasoa',
      birthDate: new Date('2011-01-01'),
    })
  }, [])
  return (
    <Sheet
      title={`Fiche de ${person.firstName}`}
      data={person}
      editable={false}
      deletable={false}
      properties={properties}
    />
  )
}

export default SheetTest
