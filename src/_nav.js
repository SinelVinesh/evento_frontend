import React from "react";
import CIcon from "@coreui/icons-react";
import {cilChevronDoubleRight} from "@coreui/icons";
import {CNavGroup, CNavItem, CNavTitle} from "@coreui/react";

const json = sessionStorage.getItem('role');
let role = false;
if (json !== null && json !== undefined) {
  try {
    role = JSON.parse(sessionStorage.getItem('role'));
  } catch (e) {
    console.log(e);
  }
}

const _nav_admin = [
  {
    component: CNavGroup,
    name: 'Type de lieu',
    to: '/location-types',
    icon: <CIcon icon={cilChevronDoubleRight} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/location-types/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/location-types/create',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Lieux',
    to: '/locations',
    icon: <CIcon icon={cilChevronDoubleRight} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/locations/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/locations/create',
      }
    ],
  },
  {
    component: CNavTitle,
    name: 'Dépenses'
  },
  {
    component: CNavGroup,
    name: 'Types de dépense tarifée',
    to: '/rated-expense-types',
    icon: <CIcon icon={cilChevronDoubleRight} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/rated-expense-types/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/rated-expense-types/create',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Dépenses tarifées',
    to: '/rated-expenses',
    icon: <CIcon icon={cilChevronDoubleRight} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/rated-expenses/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/rated-expenses/create',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Dépenses variables',
    to: '/variable-expenses',
    icon: <CIcon icon={cilChevronDoubleRight} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/variable-expenses/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/variable-expenses/create',
      }
    ],
  },
]


const _nav_user = []

const _nav = role.id === 1 ? _nav_admin : _nav_user;
export default _nav
