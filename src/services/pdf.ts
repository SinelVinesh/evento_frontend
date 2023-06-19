import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart } from "chart.js";

export const generateTablePdf = (title:string, name: string, head: any[], body: any, chartId?: string) => {
  const doc = new JsPDF()
  doc.setFontSize(33)
  doc.text("LOAN", 15, 20)
  doc.setFontSize(22)
  doc.text(title, 15, 30)
  doc.setFontSize(16)
  let addy = 0
  if(chartId !== undefined) {
    const canvas = document.getElementById(chartId) as any
    const image = canvas.toDataURL("image/png")
    doc.addImage(image,'PNG',15,40,190,100)
    addy = 100
  }
  autoTable(doc, {
    startY: 45+addy,
    head: [head],
    body: body,
  })
  doc.save(name+".pdf")
}
