import {FieldType, SheetSectionType, ValidationType} from "./enums";
import {ReactNode} from "react";

export interface FieldProperties {
  label?: string
  name?: string
  type: FieldType
  selector: (data: any) => any
  onChange: (
    e: any,
    subName?: string,
  ) => void
  options?: SelectOption[]
  validators?: Validator[]
  feedback?: string
  inputProps?: any
  intervalName?: {
    min: string
    max: string
  }
  intervalLabel?: {
    min: string
    max: string
  }
  multiple?: any
  alternativeSelector?: (data: any) => any
}

export interface SheetSectionProperties {
  label: string
  selector: (data: any) => any
  type: SheetSectionType
  component?: ReactNode
  table?: {
    header: ReactNode,
    columns: ListColumn[]
  }
}

export interface SelectOption {
  label: string
  value: any
}

export interface Validator {
  validationType: ValidationType
  args?: any
  feedback: string
}

export interface MultipleEntriesFormOption {
  entries: any[]
  addFn: () => void
  multipleSelectionHandler: (e: any) => void
  contextActions: ReactNode
  toogleCleared?: boolean
}

export interface ListColumn {
  name: string
  selector: (data: any) => any
  sortable: boolean
  minWidth?: string
}

export interface Filter {
  label?: string
  name?: string
  filterInputType: FieldType
  intervalName?: {
    min: string
    max: string
  }
  intervalLabel?: {
    min: string
    max: string
  }
}

export interface numberInterval {
  min: number
  max: number
}
