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

const routes = [
  {path: '/monthly-profit/list', element: Login},
  {path: '/materials/list', element: MaterialList},
  {path: '/materials/create', element: MaterialAddForm},
  {path: '/location-types/list', element: LocationTypeList},
  {path: '/location-types/create', element: LocationTypeAddForm},
  {path: '/locations/list', element: LocationList},
  {path: '/locations/create', element: LocationAddForm},
]

export default routes
