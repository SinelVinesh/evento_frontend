import React, { useEffect, useState } from "react";
import { Filter, ListColumn, numberInterval } from "../common/types";
import { differenceInYears } from "date-fns";
import List from "../components/generic/List";
import { FieldType } from "../common/enums";

interface Person {
  firstName: string
  lastName: string
  birthDate: Date
}

interface PersonFilter {
  firstName?: string
  lastName?: string
  age?: numberInterval
}

const peopleList: Person[] = [
  { firstName: 'Rakoto', lastName: 'jean', birthDate: new Date('2002-12-01') },
  { firstName: 'John', lastName: 'Doe', birthDate: new Date('1980-01-01') },
  { firstName: 'Jane', lastName: 'Doe', birthDate: new Date('1985-02-15') },
  { firstName: 'Bob', lastName: 'Smith', birthDate: new Date('1992-05-30') },
  { firstName: 'Alice', lastName: 'Johnson', birthDate: new Date('1978-09-10') },
  { firstName: 'David', lastName: 'Lee', birthDate: new Date('1999-12-25') },
  { firstName: 'Emma', lastName: 'Garcia', birthDate: new Date('1991-03-20') },
  { firstName: 'Michael', lastName: 'Miller', birthDate: new Date('1983-11-05') },
  { firstName: 'Sophia', lastName: 'Brown', birthDate: new Date('1995-07-08') },
  { firstName: 'William', lastName: 'Davis', birthDate: new Date('1975-04-17') },
  { firstName: 'Olivia', lastName: 'Wilson', birthDate: new Date('1989-06-22') },
  { firstName: 'James', lastName: 'Anderson', birthDate: new Date('1982-08-11') },
  { firstName: 'Ava', lastName: 'Jackson', birthDate: new Date('1990-10-07') },
  { firstName: 'Daniel', lastName: 'Taylor', birthDate: new Date('1979-12-03') },
  { firstName: 'Mia', lastName: 'Clark', birthDate: new Date('1993-01-18') },
  { firstName: 'Joseph', lastName: 'Rodriguez', birthDate: new Date('1986-07-29') },
  { firstName: 'Emily', lastName: 'Scott', birthDate: new Date('1981-09-12') },
  { firstName: 'David', lastName: 'Campbell', birthDate: new Date('2001-11-03') },
  { firstName: 'Abigail', lastName: 'Perez', birthDate: new Date('1997-12-15') },
  { firstName: 'Christopher', lastName: 'Evans', birthDate: new Date('1976-04-08') },
  { firstName: 'Charlotte', lastName: 'Turner', birthDate: new Date('1984-05-16') },
  { firstName: 'Matthew', lastName: 'Collins', birthDate: new Date('1994-02-24') },
  { firstName: 'Isabella', lastName: 'Stewart', birthDate: new Date('1988-06-14') },
  { firstName: 'Andrew', lastName: 'Morris', birthDate: new Date('1977-08-02') },
  { firstName: 'Ella', lastName: 'Nguyen', birthDate: new Date('1996-01-30') },
  { firstName: 'Jacob', lastName: 'Murphy', birthDate: new Date('1987-03-19') },
  { firstName: 'Victoria', lastName: 'Rivera', birthDate: new Date('1998-07-25') },
  { firstName: 'Ryan', lastName: 'Cook', birthDate: new Date('1980-09-28') },
  { firstName: 'Liam', lastName: 'Bailey', birthDate: new Date('1990-12-31') },
  { firstName: 'Grace', lastName: 'Hill', birthDate: new Date('1992-05-12') },
  { firstName: 'Benjamin', lastName: 'Mitchell', birthDate: new Date('1983-06-09') },
  { firstName: 'Chloe', lastName: 'Carter', birthDate: new Date('1989-08-26') },
  { firstName: 'Joshua', lastName: 'Sanders', birthDate: new Date('1995-10-22') },
  { firstName: 'Madison', lastName: 'Price', birthDate: new Date('1981-02-02') },
  { firstName: 'William', lastName: 'Baker', birthDate: new Date('1978-03-07') },
  { firstName: 'Lily', lastName: 'Nelson', birthDate: new Date('1993-04-23') },
  { firstName: 'Nicholas', lastName: 'Adams', birthDate: new Date('2000-08-13') },
  { firstName: 'Samantha', lastName: 'Roberts', birthDate: new Date('1999-01-08') },
  { firstName: 'Tyler', lastName: 'Turner', birthDate: new Date('1986-11-26') },
  { firstName: 'Natalie', lastName: 'Phillips', birthDate: new Date('1984-12-19') },
  { firstName: 'Ethan', lastName: 'Campbell', birthDate: new Date('1991-06-11') },
  { firstName: 'Avery', lastName: 'Parker', birthDate: new Date('1979-09-21') },
  { firstName: 'Hannah', lastName: 'Collins', birthDate: new Date('1997-10-14') },
  { firstName: 'Mason', lastName: 'Morris', birthDate: new Date('1982-02-04') },
  { firstName: 'Aria', lastName: 'Peterson', birthDate: new Date('1988-03-31') },
]
const TestList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0)
  const [rowPerPage, setRowPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [people, setPeople] = useState([] as Person[])
  const [filter] = useState({} as PersonFilter)
  const [triggerFilter, setTriggerFilter] = useState(false)
  const handlePageChange = (page: number) => {
    setLoading(true)
    setCurrentPage(page)
  }

  const handleRowPerPageChange = (newRowPerPage: number) => {
    setLoading(true)
    setRowPerPage(newRowPerPage)
  }

  const columns: ListColumn[] = [
    {
      name: 'Nom',
      selector: (row: Person) => row.lastName,
      sortable: true,
    },
    {
      name: 'Prénom',
      selector: (row: Person) => row.firstName,
      sortable: true,
    },
    {
      name: 'Age',
      selector: (row: Person) => differenceInYears(Date.now(), row.birthDate),
      sortable: true,
    },
  ]

  const filters: Filter[] = [
    {
      label: 'Nom',
      name: 'lastName',
      filterInputType: FieldType.text,
    },
    {
      label: 'Prénom',
      name: 'firstName',
      filterInputType: FieldType.text,
    },
    {
      filterInputType: FieldType.numberInterval,
      intervalName: {
        min: 'min',
        max: 'max',
      },
      intervalLabel: {
        min: 'Age minimum',
        max: 'Age maximum',
      },
    },
  ]

  const filterData = () => {
    let filteredPeople = peopleList.slice()
    if (filter.lastName) {
      filteredPeople = filteredPeople.filter((person) =>
        person.lastName.toLowerCase().includes(filter.lastName!.toLowerCase()),
      )
    }
    if (filter.firstName) {
      filteredPeople = filteredPeople.filter((person) =>
        person.firstName.toLowerCase().includes(filter.firstName!.toLowerCase()),
      )
    }
    if (filter.age) {
      filteredPeople = filteredPeople.filter((person) => {
        if (filter.age) {
          if (
            filter.age.min !== undefined &&
            differenceInYears(Date.now(), person.birthDate) < filter.age.min
          ) {
            return false
          }
          if (
            filter.age.max !== undefined &&
            differenceInYears(Date.now(), person.birthDate) > filter.age.max
          ) {
            return false
          }
        }
        return true
      })
    }
    return filteredPeople
  }

  const filterFn = () => {
    setTriggerFilter(!triggerFilter)
  }

  useEffect(() => {
    setPeople(peopleList.slice(0, rowPerPage))
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [people])
  useEffect(() => {
    handlePageChange(1)
  }, [triggerFilter])
  useEffect(() => {
    const filteredPeople = filterData()
    setTotalRows(filteredPeople.length)
    setPeople(filteredPeople.slice((currentPage - 1) * rowPerPage, currentPage * rowPerPage))
  }, [rowPerPage, currentPage])
  return (
    <List
      data={people}
      columns={columns}
      title={'Liste des personnes'}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filters={filters}
      filterFn={filterFn}
    />
  )
}

export default TestList
