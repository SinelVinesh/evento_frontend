import React from "react";
import {CButton, CCard, CCardBody, CCarousel, CCarouselItem, CCol, CImage, CRow} from "@coreui/react";
import Datatable from "./Datatable";
import {useNavigate} from "react-router-dom";
import {SheetSectionProperties} from "../../common/types";
import {SheetSectionType} from "../../common/enums";

interface SheetProps {
  title: string
  properties: SheetSectionProperties[]
  data: any
  deletable: boolean
  editable: boolean
}

const Sheet: React.FC<SheetProps> = ({title, properties, data, deletable, editable}) => {
  const navigate = useNavigate()
  return (
    <>
      <CCard>
        <CCardBody>
          <CRow>
            <h4 className="card-title">{title}</h4>
          </CRow>
          {properties.map((property) => (
            <>
              <CRow key={property.label}>
                <CCol sm={12}>
                  <p className="card-text">
                    <strong>{property.label} :</strong>
                  </p>
                  {property.type === SheetSectionType.images && (
                    <CRow>
                      <CCol sm={{span: 6, offset: 3}}>
                        <CCarousel controls indicators>
                          {Array.isArray(property.selector(data)) &&
                            property.selector(data).map((image: any, index: string) => (
                              <CCarouselItem key={image}>
                                <CImage className={'d-block w-100 h-50'} src={image} alt={index}/>
                              </CCarouselItem>
                            ))}
                        </CCarousel>
                      </CCol>
                    </CRow>
                  )}
                  {property.type === SheetSectionType.image && (
                    <CRow>
                      <CCol sm={{span: 6}}>
                        <CImage className={'profile-photo'} src={property.selector(data)}/>
                      </CCol>
                    </CRow>
                  )}
                  {property.type === SheetSectionType.table && (
                    <>
                      <CRow>{property.table?.header}</CRow>
                      <CRow>
                        <Datatable data={property.selector(data)} columns={property.table!.columns}/>
                      </CRow>
                    </>
                  )}
                  {property.type === SheetSectionType.text && property.selector(data)}
                </CCol>
              </CRow>
              {property.type === SheetSectionType.component && property.component}
            </>
          ))}
          <CRow>
            <CCol sm={12}>
              {editable && (
                <CButton color={'primary'} onClick={() => navigate('modify')}>
                  Modifier
                </CButton>
              )}
              {deletable && <CButton color={'warning'}>Supprimer</CButton>}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Sheet
