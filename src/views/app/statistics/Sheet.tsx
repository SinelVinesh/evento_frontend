import Sheet from "components/generic/Sheet";
import React, {useEffect, useState} from "react";
import {SheetSectionProperties} from "../../../common/types";
import {SheetSectionType} from "../../../common/enums";
import {EventEstimation} from "../../../common/appTypes";
import {getEventEstimation} from "../../../services/Api";
import {useParams} from "react-router-dom";
import {CChart} from "@coreui/react-chartjs";
import {CCol, CRow} from "@coreui/react";

const SheetTest: React.FC = () => {
  const [data, setData] = useState({} as EventEstimation)
  const [statLabels, setStatLabels] = useState([] as string[])
  const [statDatas, setStatDatas] = useState([] as number[])
  const [colors, setColors] = useState([] as string[])

  const apiCall = getEventEstimation;
  const params = useParams();
  const id = params.id as string

  const properties: SheetSectionProperties[] = [
    {
      label: "Nom de l'evenement",
      type: SheetSectionType.text,
      selector: (data: EventEstimation) => data.event?.name,
    },
    {
      label: 'Repartition des depenses',
      type: SheetSectionType.component,
      selector: () => {
      },
      component: <CRow>
        <CCol><CChart
          type="pie"
          style={{height: '400px', width: '400px'}}
          data={{
            labels: statLabels,
            datasets: [
              {
                backgroundColor: colors,
                data: statDatas,
              },
            ],
          }}
        /></CCol></CRow>
    }
  ]
  useEffect(() => {
    apiCall(id).then((response) => {
      const data: EventEstimation = response.data
      const labels = ['Location lieu']
      const datas = [data.event?.locationPrice!]
      const ratedTypes: number[] = []
      if (data.event?.ratedExpenses !== undefined && data.event?.ratedExpenses !== null) {
        for (const ratedExpense of data?.event?.ratedExpenses!) {
          // check if the rated type is inside ratedTypes
          if (ratedTypes.indexOf(ratedExpense.ratedExpense?.ratedExpenseType?.id!) === -1) {
            ratedTypes.push(ratedExpense.ratedExpense?.ratedExpenseType?.id!)
            labels.push(ratedExpense.ratedExpense?.ratedExpenseType?.name as string)
          }
        }
        for (const type of ratedTypes) {
          datas.push(data.event?.ratedExpenses?.filter((e) => e.ratedExpense?.ratedExpenseType?.id === type).reduce((a, b) => a + b.ratedExpense?.rentPrice! * b.duration! * b.quantity, 0))
        }
      }
      if (data.event?.variableExpenses !== undefined && data.event?.variableExpenses !== null) {
        for (const variableExpense of data?.event?.variableExpenses!) {
          labels.push(variableExpense.variableExpense?.name as string)
          datas.push(variableExpense.quantity * variableExpense.amount!)
        }
      }
      const colors = []
      // fil colors with 50 hex colors with a pastel palette
      colors.push('#FFB6C1')
      colors.push('#FFC0CB')
      colors.push('#FF69B4')
      colors.push('#FF1493')
      colors.push('#DB7093')
      colors.push('#C71585')
      colors.push('#E6E6FA')
      colors.push('#D8BFD8')
      colors.push('#DDA0DD')
      colors.push('#DA70D6')
      colors.push('#EE82EE')
      colors.push('#FF00FF')
      colors.push('#BA55D3')
      colors.push('#9370DB')
      colors.push('#8A2BE2')
      colors.push('#9400D3')
      colors.push('#9932CC')
      colors.push('#8B008B')
      colors.push('#800080')
      colors.push('#4B0082')
      colors.push('#6A5ACD')
      colors.push('#483D8B')
      colors.push('#7B68EE')
      colors.push('#ADFF2F')
      colors.push('#7FFF00')
      colors.push('#7CFC00')
      colors.push('#00FF00')
      colors.push('#32CD32')
      colors.push('#98FB98')
      colors.push('#90EE90')
      colors.push('#00FA9A')
      colors.push('#00FF7F')
      colors.push('#3CB371')
      colors.push('#2E8B57')
      colors.push('#228B22')
      colors.push('#008000')
      colors.push('#006400')
      colors.push('#9ACD32')
      colors.push('#6B8E23')
      colors.push('#808000')
      colors.push('#556B2F')
      colors.push('#66CDAA')
      colors.push('#8FBC8F')
      colors.push('#20B2AA')
      colors.push('#008B8B')
      colors.push('#008080')
      colors.push('#00FFFF')
      colors.push('#00FFFF')
      colors.push('#E0FFFF')
      colors.push('#AFEEEE')
      colors.push('#7FFFD4')
      colors.push('#40E0D0')
      colors.push('#48D1CC')
      colors.push('#00CED1')
      colors.push('#5F9EA0')
      colors.push('#4682B4')
      colors.push('#B0C4DE')
      colors.push('#ADD8E6')
      colors.push('#B0E0E6')
      colors.push('#87CEFA')
      colors.push('#87CEEB')
      colors.push('#6495ED')
      colors.push('#00BFFF')
      colors.push('#1E90FF')
      colors.push('#4169E1')
      colors.push('#0000FF')
      colors.push('#0000CD')
      colors.push('#00008B')
      colors.push('#000080')
      colors.push('#191970')
      colors.push('#FFF8DC')
      colors.push('#FFEBCD')
      colors.push('#FFE4C4')

      setColors(colors)
      setStatLabels(labels)
      setStatDatas(datas)
      setData(response.data)
    })

  }, [])
  return (
    <> {Object.keys(data).length !== 0 && (
      <Sheet
        title={`Stat de ${data.event?.name}`}
        data={data}
        editable={false}
        deletable={false}
        properties={properties}
      />
    )}
    </>
  )
}

export default SheetTest
