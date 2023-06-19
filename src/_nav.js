import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cil3d,
  cilCart,
  cilChevronDoubleRight,
  cilDollar,
  cilFire,
  cilLaptop,
  cilScreenDesktop,
  cilSpeedometer,
  cilSwapHorizontal,
  cilUser
} from "@coreui/icons";
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
    component: CNavItem,
    name: 'Tableau de bord',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon"/>,
  },
  {
    component: CNavTitle,
    name: 'Références',
  },
  {
    component: CNavGroup,
    name: 'Processeur',
    to: '/cpus',
    icon: <CIcon icon={cilChevronDoubleRight} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/cpus/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/cpus/create',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Marque',
    to: '/brands',
    icon: <CIcon icon={cilFire} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/brands/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/brands/create',
      }
    ],
  },
  {
    component: CNavGroup,
    name: "Type d'écran",
    to: '/screen-types',
    icon: <CIcon icon={cilScreenDesktop} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/screen-types/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/screen-types/create',
      }
    ],
  },
  {
    component: CNavGroup,
    name: "Modèle de laptop",
    to: '/laptop-models',
    icon: <CIcon icon={cilLaptop} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/laptop-models/list',
      },
      {
        component: CNavItem,
        name: "Formulaire d'ajout",
        to: '/laptop-models/create',
      }
    ],
  },
  {
    component: CNavTitle,
    name: 'Interne',
  },
  {
    component: CNavGroup,
    name: "Utilisateurs",
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/users/list',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Stock',
    to: '/stock/list',
    icon: <CIcon icon={cil3d} customClassName="nav-icon"/>,
  },
  {
    component: CNavTitle,
    name: 'Transactions',
  },
  {
    component: CNavItem,
    name: "Achat de laptop",
    to: '/laptop-models/buy',
    icon: <CIcon icon={cilCart} customClassName="nav-icon"/>
  }
]


const _nav_user = [
  {
    component: CNavGroup,
    name: 'Matériels',
    to: '/materials',
    icon: <CIcon icon={cilChevronDoubleRight} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Liste',
        to: '/materials/list',
      }
    ],
  },
  {
    component: CNavItem,
    name: 'Stock',
    to: '/stock/list',
    icon: <CIcon icon={cil3d} customClassName="nav-icon"/>,
  },
  {
    component: CNavTitle,
    name: 'Transactions',
  },
  {
    component: CNavGroup,
    name: "Vente de laptop",
    to: '/laptop-models/sell',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Formulaire de vente',
        to: '/laptop-models/sell',
      },
      {
        component: CNavItem,
        name: 'Liste des ventes effectuées',
        to: '/sales/list',
      }
    ]
  },
  {
    component: CNavGroup,
    name: "Transferts",
    to: '/stock',
    icon: <CIcon icon={cilSwapHorizontal} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'formulaire de retour',
        to: '/stock/return',
      },
      {
        component: CNavItem,
        name: 'Liste des transferts en attente',
        to: '/stock/dispatch/pending/list',
      }
    ],
  },
]

const _nav = role.id === 1 ? _nav_admin : _nav_user;
export default _nav
