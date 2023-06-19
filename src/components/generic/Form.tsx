import React, { useState } from "react";
import { CButton, CCard, CCardBody, CCardHeader, CCol, CFormLabel, CRow } from "@coreui/react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import EditableGallery from "./EditableGallery";
import Datatable from "./Datatable";
import { FieldProperties, MultipleEntriesFormOption } from "../../common/types";
import { FieldType } from "../../common/enums";
import { validate } from "../../services/Validation";

interface FormProps {
  data: any
  properties: FieldProperties[]
  submitFn?: () => void
  multipleEntriesOption?: MultipleEntriesFormOption
  submitText?: string
  initialSubmitAllowed?: boolean
  className?: string
  bodyTop?: React.ReactNode
  title?: string
  noSubmint?: boolean
}

const Form: React.FC<FormProps> = ({
  data,
  properties,
  submitFn,
  multipleEntriesOption,
  submitText,
  initialSubmitAllowed = false,
  className,
  bodyTop,
  title,
  noSubmint
}) => {
  const [removeInitialSubmit, setRemoveInitialSubmit] = useState(initialSubmitAllowed)
  const [feedbacks, setFeebacks] = useState({} as any)
  const isMultiple = multipleEntriesOption !== null && multipleEntriesOption != undefined
  const basicInputs: FieldType[] = [
    FieldType.text,
    FieldType.number,
    FieldType.email,
    FieldType.password,
    FieldType.date,
    FieldType.time,
    FieldType.datetime,
    FieldType.month,
    FieldType.week,
  ]
  let columns: any[] = []
  if (isMultiple) {
    columns = properties.map((property) => {
      return {
        name: property.label,
        selector: (property.type === FieldType.select) ? property.alternativeSelector : property.selector,
        sortable: true,
      }
    })
  }
  return (
    <CCard className={className}>
      {title && (
        <CCardHeader>
          <h4>{title}</h4>
        </CCardHeader>
      )}
      <CCardBody>
        {bodyTop}
        {properties.map((property) => (
          <div className={'row mb-2'} key={property.name}>
            <div className={'col-12'}>
              {basicInputs.find((input) => {
                return input === property.type
              }) !== undefined && (
                <TextField
                  variant={'standard'}
                  type={property.type}
                  defaultValue={property.selector(data)}
                  name={property.name}
                  label={property.label}
                  error={feedbacks[property.name!] !== undefined}
                  helperText={feedbacks[property.name!]}
                  fullWidth
                  onChange={property.onChange}
                  InputProps={property.inputProps}
                  InputLabelProps={
                    property.type === FieldType.date || property.type === FieldType.datetime
                      ? { shrink: true }
                      : {}
                  }
                  onBlur={() => {
                    setRemoveInitialSubmit(true)
                    let feedback = validate(property.selector(data), property.validators)
                    let entry: any = {}
                    if (feedback !== undefined) {
                      entry[property.name!] = feedback
                      setFeebacks({ ...feedbacks, ...entry })
                    } else {
                      if (property.name! in feedbacks) {
                        let newFeedbacks = { ...feedbacks }
                        delete newFeedbacks[property.name!]
                        setFeebacks(newFeedbacks)
                      }
                    }
                  }}
                />
              )}
              {property.type === FieldType.numberInterval && (
                <>
                  <TextField
                    variant={'standard'}
                    type={'number'}
                    defaultValue={property.selector(data)}
                    name={property.intervalName?.min}
                    label={property.intervalLabel?.min}
                    error={feedbacks[property.intervalName!.min] !== undefined}
                    helperText={feedbacks[property.intervalName!.min]}
                    fullWidth
                    InputProps={property.inputProps}
                    onChange={(e) => property.onChange(e, 'min')}
                    onBlur={() => {
                      setRemoveInitialSubmit(true)
                      let feedback = validate(property.selector(data), property.validators)
                      let entry: any = {}
                      if (feedback !== undefined) {
                        entry[property.intervalName!.min] = feedback
                        setFeebacks({ ...feedbacks, ...entry })
                      } else {
                        if (property.intervalName!.min in feedbacks) {
                          let newFeedbacks = { ...feedbacks }
                          delete newFeedbacks[property.intervalName!.min]
                          setFeebacks(newFeedbacks)
                        }
                      }
                    }}
                  />
                  <TextField
                    variant={'standard'}
                    type={'number'}
                    defaultValue={property.selector(data)}
                    name={property.intervalName?.max}
                    label={property.intervalLabel?.max}
                    error={feedbacks[property.intervalName!.max] !== undefined}
                    helperText={feedbacks[property.intervalName!.max]}
                    fullWidth
                    InputProps={property.inputProps}
                    onChange={(e) => property.onChange(e, 'max')}
                    onBlur={() => {
                      setRemoveInitialSubmit(true)
                      let feedback = validate(property.selector(data), property.validators)
                      let entry: any = {}
                      if (feedback !== undefined) {
                        entry[property.intervalName!.max] = feedback
                        setFeebacks({ ...feedbacks, ...entry })
                      } else {
                        if (property.intervalName!.max in feedbacks) {
                          let newFeedbacks = { ...feedbacks }
                          delete newFeedbacks[property.intervalName!.max]
                          setFeebacks(newFeedbacks)
                        }
                      }
                    }}
                  />
                </>
              )}
              {property.type === FieldType.textArea && (
                <TextField
                  variant={'standard'}
                  label={property.label}
                  defaultValue={property.selector(data)}
                  multiline
                  maxRows={4}
                  fullWidth
                  InputProps={property.inputProps}
                  onChange={property.onChange}
                />
              )}
              {property.type === FieldType.select && (
                <FormControl variant={'standard'} fullWidth>
                  <InputLabel id={property.label}>{property.label}</InputLabel>
                  <Select
                    labelId={property.label}
                    defaultValue={property.selector(data)}
                    variant={'standard'}
                    onChange={(e) => property.onChange(e)}
                  >
                    {property.options?.map((option) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {property.type === FieldType.disabled && (
                <>
                  <CFormLabel>{property.label}</CFormLabel>
                  <TextField
                    variant={'standard'}
                    type={property.type}
                    defaultValue={property.selector(data)}
                    name={property.name}
                    fullWidth
                    InputProps={property.inputProps}
                    disabled={true}
                  />
                </>
              )}
              {property.type === FieldType.imageGallery && (
                <>
                  <CFormLabel>{property.label}</CFormLabel>
                  <EditableGallery
                    links={property.selector(data)}
                    changeLinks={property.onChange}
                  />
                </>
              )}
              {property.type === FieldType.multiple && (
                <Form
                  bodyTop={property.multiple.bodyTop}
                  data={property.multiple.data}
                  properties={property.multiple.properties}
                  noSubmint={true}
                  multipleEntriesOption={property.multiple.multipleEntriesOption}
                />
              )}
            </div>
          </div>
        ))}
        <CRow>
          <CCol sm={12}>
            <CButton
              color={'primary'}
              onClick={isMultiple ? multipleEntriesOption!.addFn : submitFn}
              disabled={!removeInitialSubmit || Object.keys(feedbacks).length !== 0}
            >
              {isMultiple ? 'Ajouter' : submitText}
            </CButton>
          </CCol>
        </CRow>
        {isMultiple && (
          <>
            <Datatable
              data={multipleEntriesOption!.entries}
              title={"Liste"}
              columns={columns}
              selectable
              handleRowSelection={multipleEntriesOption!.multipleSelectionHandler}
              contextActions={multipleEntriesOption!.contextActions}
              clearRow={multipleEntriesOption!.toogleCleared}
            />
            {!noSubmint && (
            <CButton
              color={'primary'}
              onClick={submitFn}
              disabled={!removeInitialSubmit || Object.keys(feedbacks).length !== 0}
            >
              {submitText}
            </CButton>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}
export default Form
