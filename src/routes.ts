import React from "react";

const Login = React.lazy(() => import('./views/app/login/Login'))
const routes = [
  {path: '/monthly-profit/list', element: Login},
]

export default routes
