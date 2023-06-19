import React, { ReactNode } from "react";
import { CCard, CCardBody, CRow } from "@coreui/react";

import Datatable from "./Datatable";
import { Filter, ListColumn } from "../../common/types";

interface ListProps {
  data: any
  columns: ListColumn[]
  title: string
  selectable?: boolean
  linkFn?: (row: any) => string
  handleRowSelection?: (selection: any) => void
  contextActions?: ReactNode
  selectableRowDisabledFn?: (row: any) => boolean
  clearRow?: boolean
  totalRows: number
  loading: boolean
  onChangePage: (page: number) => void
  filterData: any
  filters?: Filter[]
  filterFn: () => void
  header?: ReactNode
}

const List: React.FC<ListProps> = ({
  data,
  columns,
  title,
  selectable = false,
  linkFn,
  selectableRowDisabledFn,
  handleRowSelection,
  contextActions,
  clearRow,
  totalRows,
  loading,
  onChangePage,
  filterData,
  filters,
  filterFn,
  header
}) => {
  return (
    <>
      <CCard>
        <CCardBody>
          <CRow>
            {header}
          </CRow>
          <CRow>
            <Datatable
              title={title}
              columns={columns}
              data={data}
              selectable={selectable}
              selectableRowDisabled={selectableRowDisabledFn}
              linkFn={linkFn}
              contextActions={contextActions}
              handleRowSelection={handleRowSelection}
              clearRow={clearRow}
              totalRows={totalRows}
              loading={loading}
              onChangePage={onChangePage}
              filterData={filterData}
              filters={filters}
              filterFn={filterFn}
            />
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}
export default List
