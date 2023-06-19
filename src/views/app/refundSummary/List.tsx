import React, {useEffect, useState} from "react";
import {formatNumber} from "services/Format";
import {MonthlyRefund, MonthlyRefundFilter} from "../../../common/appTypes";
import {Filter, ListColumn} from "../../../common/types";
import List from "../../../components/generic/List";
import {findAllRefundSummary, findAllRefundSummaryPdf} from "../../../services/Api";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {FieldType} from "../../../common/enums";
import {CButton, CCol} from "@coreui/react";
import {generateTablePdf} from "../../../services/pdf";

const ConfiguredList: React.FC = () => {
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([] as MonthlyRefund[]);
  const [filter] = useState({ page: 1 } as MonthlyRefundFilter);
  const [triggerFilter, setTriggerFilter] = useState(false);
  const apiCall = findAllRefundSummary;
  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    if (currentPage === page) {
      filterData();
    }
  };

  const columns: ListColumn[] = [
    {
      name: "Id",
      selector: (row: MonthlyRefund) => row.id,
      sortable: true
    },
    {
      name: "Période",
      selector: (row: MonthlyRefund) => format(new Date(row.year!,row.month!-1,1),"MMMM yyyy", {locale: fr}),
      sortable: true
    },
    {
      name: "Montant remboursé (Ar)",
      selector: (row: MonthlyRefund) => formatNumber(row.totalRefund),
      sortable: true
    }
  ];

  const filters: Filter[] = [
    {
      label: 'Mois minimum',
      name: 'minMonth',
      filterInputType: FieldType.number
    },
    {
      label: 'Année minimum',
      name: 'minYear',
      filterInputType: FieldType.number
    },
    {
      label: 'Mois maximum',
      name: 'maxMonth',
      filterInputType: FieldType.number
    },
    {
      label: 'Année maximum',
      name: 'maxYear',
      filterInputType: FieldType.number
    }
  ]

  const filterData = () => {
    apiCall(filter)
      .then((response) => {
        setTotalRows(response.data.count);
        setData(response.data.elements);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filterFn = () => {
    setTriggerFilter(!triggerFilter);
  };

  // pdf
  const pdfHead = ["Période", "Montant remboursé (Ar)"];
  const buildPdf = () => {
    findAllRefundSummaryPdf(filter).then((res) => {
      const body = res.data.elements.map((row: MonthlyRefund) => [
        format(new Date(row.year!,row.month!-1,1),"MMMM yyyy", {locale: fr}),
        formatNumber(row.totalRefund)
      ]);
      generateTablePdf("Montant remboursé mensuel",`Refund-monthly-${new Date().getTime()}`,pdfHead,body)
    })
  }


  useEffect(() => {
    filterData();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [data]);
  useEffect(() => {
    handlePageChange(1);
  }, [triggerFilter]);
  useEffect(() => {
    filter.page = currentPage;
    filterData();
  }, [currentPage]);
  return (
    <List
      header={(
        <>
          <CCol xs={3}>
            <CButton
              onClick={(e) =>{buildPdf()}}>
              Exporter en PDF
            </CButton>
          </CCol>
        </>)}
      data={data}
      columns={columns}
      title={"Liste des remboursements mensuels"}
      totalRows={totalRows}
      loading={loading}
      onChangePage={handlePageChange}
      filterData={filter}
      filterFn={filterFn}
      filters={filters}
    />
  );
};

export default ConfiguredList;
