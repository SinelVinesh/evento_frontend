import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";

const AppContent = () => {
  const json = sessionStorage.getItem("role") ?? ""
  const role = JSON.parse(json)
  const home = role?.id === 1 ? "/sales/list" : "dashboard"
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && <Route key={idx} path={route.path} element={<route.element />} />
            )
          })}
          <Route path="/" element={<Navigate to={home} replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
