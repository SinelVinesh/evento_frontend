import React, { Component, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./scss/style.scss";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/app/login/Login'))

class App extends Component {
  render() {
    const isAuth = sessionStorage.getItem('token') !== null
    const layout = isAuth ? <DefaultLayout/> : <Login/>
    return (
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={layout} />
        </Routes>
      </Suspense>
    )
  }
}

export default App
