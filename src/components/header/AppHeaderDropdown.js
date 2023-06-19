import React from "react";
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from "@coreui/react";
import {
  cilBell,
  cilCommentSquare,
  cilCreditCard,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import avatar8 from "./../../assets/images/avatars/8.jpg";
import { useNavigate } from "react-router-dom";

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem href="#" onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Se déconnecter
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
