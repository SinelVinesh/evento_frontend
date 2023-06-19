import Accordion from "@mui/material/Accordion";
import React from "react";
import { AccordionDetails, AccordionSummary, SelectChangeEvent, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FieldProperties, Filter } from "../../common/types";
import Form from "./Form";

interface FilterProps {
  title?: string
  filters: Filter[]
  filterSubmitText?: string
  submitFn: () => void
  filterData: any
}

const FilterBar: React.FC<FilterProps> = ({
  title = 'Filtres',
  submitFn,
  filterSubmitText = 'Filter',
  filters,
  filterData,
}) => {
  const filterProperties: FieldProperties[] = []
  for (const filter of filters) {
    filterProperties.push({
      name: filter.name,
      label: filter.label,
      type: filter.filterInputType,
      selector: (data: any) => data[filter.name!],
      onChange: (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent<any>,
        sub?: string,
      ) => {
        if (sub) {
          let temp: any = {}
          temp[sub] = e.target.value
          filterData[filter.name!] = { ...filterData[filter.name!], ...temp }
        } else {
          filterData[filter.name!] = e.target.value
        }
      },
      intervalLabel: filter.intervalLabel,
      intervalName: filter.intervalName,
    })
  }
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Form
          data={filterData}
          properties={filterProperties}
          submitFn={submitFn}
          submitText={filterSubmitText}
          className={'border-none'}
          initialSubmitAllowed={true}
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default FilterBar
