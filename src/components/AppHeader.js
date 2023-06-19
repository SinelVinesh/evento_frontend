import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CAlert,
  CBadge,
  CButton,
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";
import { findCurrentClient } from "../services/Api";
import { AppHeaderDropdown } from "./header/index";
import { logo } from "../assets/brand/logo";
import { formatNumber } from "services/Format";

const AppHeader = () => {
  const [balance, setBalance] = React.useState(0)
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const json = sessionStorage.getItem("role") ?? ""
  const role = JSON.parse(json)
  const home = role?.id === 1 ? "/sales/list" : "/dashboard"
  const username = sessionStorage.getItem("username") ?? ""
  useEffect(() => {
    if (role?.id === 2) {
      findCurrentClient().then((data) => {
        setBalance(data.data.balance)
      })
    }
  },[])
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <h4>LOAN.CO</h4>
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to={home} component={NavLink}>
              Home
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          {role?.id === 2 && (
            <CNavItem className="mx-2">
              <CButton color="success" disabled>
                Ar {formatNumber(balance)}
              </CButton>
            </CNavItem>
          )}
          <CNavItem className="d-flex align-items-center">
            {username}
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
