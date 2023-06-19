import React, { ReactNode, useEffect, useState } from "react";
import { CCol } from "@coreui/react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Filter, ListColumn } from "../../common/types";
import FilterBar from "./FilterBar";

interface AdvancedDatatableProps {
  data: any
  columns: ListColumn[]
  title?: string
  selectable?: boolean
  linkFn?: (row: any) => string
  handleRowSelection?: (selection: any) => void
  contextActions?: ReactNode
  selectableRowDisabled?: (row: any) => boolean
  clearRow?: boolean
  totalRows?: number
  loading?: boolean
  onChangePage?: (page: number) => void
  onChangeRowsPerPage?: (newPerPage: number, page: number) => void
  filterData?: any
  filters?: Filter[]
  filterFn?: () => void
}
const Datatable: React.FC<AdvancedDatatableProps> = ({
  data,
  columns,
  title,
  selectable = false,
  linkFn,
  handleRowSelection,
  contextActions,
  selectableRowDisabled,
  clearRow,
  loading,
  onChangeRowsPerPage,
  onChangePage,
  totalRows,
  filters,
  filterFn,
  filterData,
}) => {
  const [filteredData, setFiltered] = useState([] as any[])
  const filterBar = React.useMemo(() => {
    return (
      <>
        {/*<CCol sm={12} className={'mb-3'}>*/}
        {/*  <TextField*/}
        {/*    variant={'outlined'}*/}
        {/*    placeholder={'Recherche rapide...'}*/}
        {/*    fullWidth*/}
        {/*    size={'small'}*/}
        {/*    InputProps={{*/}
        {/*      startAdornment: (*/}
        {/*        <InputAdornment position={'start'}>*/}
        {/*          <SearchIcon />*/}
        {/*        </InputAdornment>*/}
        {/*      ),*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</CCol>*/}
        {filters && filterFn && (
          <CCol sm={12}>
            <FilterBar filterData={filterData} filters={filters} submitFn={filterFn} />
          </CCol>
        )}
      </>
    )
  }, [data])
  const navigate = useNavigate()
  useEffect(() => {
    setFiltered(data)
  }, [data])
  return (
    <DataTable
      title={title}
      columns={columns}
      data={filteredData}
      selectableRows={selectable}
      onSelectedRowsChange={handleRowSelection}
      selectableRowDisabled={
        selectableRowDisabled !== undefined ? selectableRowDisabled : () => false
      }
      subHeader
      contextActions={contextActions}
      subHeaderComponent={filterBar}
      className={linkFn !== undefined ? 'clickable' : ''}
      onRowClicked={(row) => {
        if (linkFn !== undefined) navigate(linkFn(row))
      }}
      customStyles={{ rows: { style: { cursor: linkFn !== undefined ? 'pointer' : 'default' } } }}
      clearSelectedRows={clearRow}
      pagination
      paginationServer={totalRows !== undefined}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      progressPending={loading}
      paginationTotalRows={totalRows}
      paginationComponentOptions={{noRowsPerPage: true}}
    />
  )
}

export default Datatable
