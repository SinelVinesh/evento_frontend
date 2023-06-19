import React from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CContainer, CHeader, CHeaderBrand, CHeaderNav, CHeaderToggler, CNavItem, CNavLink} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilMenu} from "@coreui/icons";
import {AppHeaderDropdown} from "./header/index";

const AppHeader = () => {
  const [balance, setBalance] = React.useState(0)
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const json = sessionStorage.getItem("role") ?? ""
  const role = JSON.parse(json)
  const home = role?.id === 1 ? "/sales/list" : "/dashboard"
  const username = sessionStorage.getItem("username") ?? ""
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({type: 'set', sidebarShow: !sidebarShow})}
        >
          <CIcon icon={cilMenu} size="lg"/>
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
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown/>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
