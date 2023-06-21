import React from "react";

const Login = React.lazy(() => import('./views/app/login/Login'))
// materiel
const MaterialList = React.lazy(() => import('./views/app/material/List'))
const MaterialAddForm = React.lazy(() => import('./views/app/material/AddForm'))

// Type de lieu
const LocationTypeList = React.lazy(() => import('./views/app/locationType/List'))
const LocationTypeAddForm = React.lazy(() => import('./views/app/locationType/AddForm'))
const LocationTypeUpdateForm = React.lazy(() => import('./views/app/locationType/UpdateForm'))

// Lieu
const LocationList = React.lazy(() => import('./views/app/location/List'))
const LocationAddForm = React.lazy(() => import('./views/app/location/AddForm'))
const LocationUpdateForm = React.lazy(() => import('./views/app/location/UpdateForm'))

// Artistes
const ArtistList = React.lazy(() => import('./views/app/artist/List'))
const ArtistAddForm = React.lazy(() => import('./views/app/artist/AddForm'))
const ArtistUpdateForm = React.lazy(() => import('./views/app/artist/UpdateForm'))

// Type de dépense tarifée
const RatedExpenseTypeList = React.lazy(() => import('./views/app/ratedExpenseType/List'))
const RatedExpenseTypeAddForm = React.lazy(() => import('./views/app/ratedExpenseType/AddForm'))
const RatedExpenseTypeUpdateForm = React.lazy(() => import('./views/app/ratedExpenseType/UpdateForm'))

// Dépense tarifée
const RatedExpenseList = React.lazy(() => import('./views/app/ratedExpense/List'))
const RatedExpenseAddForm = React.lazy(() => import('./views/app/ratedExpense/AddForm'))
const RatedExpenseUpdateForm = React.lazy(() => import('./views/app/ratedExpense/UpdateForm'))

// Dépense variable
const VariableExpenseList = React.lazy(() => import('./views/app/variableExpense/List'))
const VariableExpenseAddForm = React.lazy(() => import('./views/app/variableExpense/AddForm'))
const VariableExpenseUpdateForm = React.lazy(() => import('./views/app/variableExpense/UpdateForm'))

// Type d'événement
const EventTypeList = React.lazy(() => import('./views/app/eventType/List'))
const EventTypeAddForm = React.lazy(() => import('./views/app/eventType/AddForm'))
const EventTypeUpdateForm = React.lazy(() => import('./views/app/eventType/UpdateForm'))

// Evenements
const EventList = React.lazy(() => import('./views/app/event/List'))
const EventAddForm = React.lazy(() => import('./views/app/event/AddForm'))
const EventUpdateForm = React.lazy(() => import('./views/app/event/UpdateForm'))
const EventSalesForm = React.lazy(() => import('./views/app/event/SalesForm'))

// Utilisateurs
const UserList = React.lazy(() => import('./views/app/user/List'))
const UserAddForm = React.lazy(() => import('./views/app/user/AddForm'))
const UserUpdateForm = React.lazy(() => import('./views/app/user/UpdateForm'))

// Paramètres
const SettingList = React.lazy(() => import('./views/app/setting/List'))
const SettingAddForm = React.lazy(() => import('./views/app/setting/AddForm'))
const SettingUpdateForm = React.lazy(() => import('./views/app/setting/UpdateForm'))

// Statistiques
const StatsList = React.lazy(() => import('./views/app/statistics/List'))
const StatsSheet = React.lazy(() => import('./views/app/statistics/Sheet'))

const routes = [
  {path: '/monthly-profit/list', element: Login},
  {path: '/materials/list', element: MaterialList},
  {path: '/materials/create', element: MaterialAddForm},
  {path: '/location-types/list', element: LocationTypeList},
  {path: '/location-types/create', element: LocationTypeAddForm},
  {path: '/location-types/:id/update', element: LocationTypeUpdateForm},
  {path: '/locations/list', element: LocationList},
  {path: '/locations/create', element: LocationAddForm},
  {path: '/locations/:id/update', element: LocationUpdateForm},
  {path: '/rated-expense-types/list', element: RatedExpenseTypeList},
  {path: '/rated-expense-types/create', element: RatedExpenseTypeAddForm},
  {path: '/rated-expense-types/:id/update', element: RatedExpenseTypeUpdateForm},
  {path: '/rated-expenses/list', element: RatedExpenseList},
  {path: '/rated-expenses/create', element: RatedExpenseAddForm},
  {path: '/rated-expenses/:id/update', element: RatedExpenseUpdateForm},
  {path: '/variable-expenses/list', element: VariableExpenseList},
  {path: '/variable-expenses/create', element: VariableExpenseAddForm},
  {path: '/variable-expenses/:id/update', element: VariableExpenseUpdateForm},
  {path: '/event-types/list', element: EventTypeList},
  {path: '/event-types/create', element: EventTypeAddForm},
  {path: '/event-types/:id/update', element: EventTypeUpdateForm},
  {path: '/events/list', element: EventList},
  {path: '/events/create', element: EventAddForm},
  {path: '/events/:id/update', element: EventUpdateForm},
  {path: '/events/:id/sales', element: EventSalesForm},
  {path: '/artists/list', element: ArtistList},
  {path: '/artists/create', element: ArtistAddForm},
  {path: '/artists/:id/update', element: ArtistUpdateForm},
  {path: '/users/list', element: UserList},
  {path: '/users/create', element: UserAddForm},
  {path: '/users/:id/update', element: UserUpdateForm},
  {path: '/settings/list', element: SettingList},
  {path: '/settings/create', element: SettingAddForm},
  {path: '/settings/:id/update', element: SettingUpdateForm},
  {path: '/statistics', element: StatsList},
  {path: '/statistics/:id', element: StatsSheet}
]

export default routes
