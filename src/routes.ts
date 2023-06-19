import React from "react";

const Login = React.lazy(() => import('./views/app/login/Login'))
// materiel
const MaterialList = React.lazy(() => import('./views/app/material/List'))
const MaterialAddForm = React.lazy(() => import('./views/app/material/AddForm'))

// Type de lieu
const LocationTypeList = React.lazy(() => import('./views/app/locationType/List'))
const LocationTypeAddForm = React.lazy(() => import('./views/app/locationType/AddForm'))

// Lieu
const LocationList = React.lazy(() => import('./views/app/location/List'))
const LocationAddForm = React.lazy(() => import('./views/app/location/AddForm'))

// Type de dépense tarifée
const RatedExpenseTypeList = React.lazy(() => import('./views/app/ratedExpenseType/List'))
const RatedExpenseTypeAddForm = React.lazy(() => import('./views/app/ratedExpenseType/AddForm'))

// Dépense tarifée
const RatedExpenseList = React.lazy(() => import('./views/app/ratedExpense/List'))
const RatedExpenseAddForm = React.lazy(() => import('./views/app/ratedExpense/AddForm'))

// Dépense variable
const VariableExpenseList = React.lazy(() => import('./views/app/variableExpense/List'))
const VariableExpenseAddForm = React.lazy(() => import('./views/app/variableExpense/AddForm'))

// Type d'événement
const EventTypeList = React.lazy(() => import('./views/app/eventType/List'))
const EventTypeAddForm = React.lazy(() => import('./views/app/eventType/AddForm'))

// Evenements
const EventList = React.lazy(() => import('./views/app/event/List'))
const EventAddForm = React.lazy(() => import('./views/app/event/AddForm'))
const EventUpdateForm = React.lazy(() => import('./views/app/event/UpdateForm'))
const routes = [
  {path: '/monthly-profit/list', element: Login},
  {path: '/materials/list', element: MaterialList},
  {path: '/materials/create', element: MaterialAddForm},
  {path: '/location-types/list', element: LocationTypeList},
  {path: '/location-types/create', element: LocationTypeAddForm},
  {path: '/locations/list', element: LocationList},
  {path: '/locations/create', element: LocationAddForm},
  {path: '/rated-expense-types/list', element: RatedExpenseTypeList},
  {path: '/rated-expense-types/create', element: RatedExpenseTypeAddForm},
  {path: '/rated-expenses/list', element: RatedExpenseList},
  {path: '/rated-expenses/create', element: RatedExpenseAddForm},
  {path: '/variable-expenses/list', element: VariableExpenseList},
  {path: '/variable-expenses/create', element: VariableExpenseAddForm},
  {path: '/event-types/list', element: EventTypeList},
  {path: '/event-types/create', element: EventTypeAddForm},
  {path: '/events/list', element: EventList},
  {path: '/events/create', element: EventAddForm},
  {path: '/events/:id/update', element: EventUpdateForm},
]

export default routes
