import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {EventEstimation} from "../common/appTypes";
import {formatDateTime, formatNumber, formatTime} from "./Format";

export const generateTablePdf = (title: string, name: string, head: any[], body: any, chartId?: string) => {
  const doc = new JsPDF()
  doc.setFontSize(33)
  doc.text("LOAN", 15, 20)
  doc.setFontSize(22)
  doc.text(title, 15, 30)
  doc.setFontSize(16)
  let addy = 0
  if (chartId !== undefined) {
    const canvas = document.getElementById(chartId) as any
    const image = canvas.toDataURL("image/png")
    doc.addImage(image, 'PNG', 15, 40, 190, 100)
    addy = 100
  }
  autoTable(doc, {
    startY: 45 + addy,
    head: [head],
    body: body,
  })
  doc.save(name + ".pdf")
}

export const generateAffiche = (data: EventEstimation) => {
  // Création d'un nouveau document JsPDF
  let doc = new JsPDF();
  const uploadDir = "http://localhost:8080/files/";
  // Définition des paramètres de mise en page
  let pageWidth = doc.internal.pageSize.getWidth();
  let pageHeight = doc.internal.pageSize.getHeight();
  let ymargin = 20;
  let xmargin = 20;

  // Ajout du nom de l'événement
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  // center the title at the top
  let titleWidth = doc.getStringUnitWidth(data?.event?.name!) * 24 / doc.internal.scaleFactor;
  let titleOffset = (pageWidth - titleWidth) / 2;
  doc.text(data?.event?.name!, titleOffset, ymargin);
  ymargin += 20

  // Ajout de la date et heure de l'événement
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`A partir de ${formatDateTime(data?.event?.startDate!)} jusqu'à ${formatTime(data.event?.endDate!)} au ${data?.event?.location?.name!}`, xmargin, ymargin);
  ymargin += 10

  // Ajout de la photo du lieu
  let imgWidth = pageWidth - 2 * xmargin;
  let imgHeight = (imgWidth * 200) / 400;
  doc.addImage(uploadDir + data.event?.location?.imageLink, "JPEG", xmargin, ymargin, imgWidth, imgHeight);
  ymargin += imgHeight + 20

  // Ajout du nom des artistes
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Avec :", xmargin, ymargin);


  // Ajout des photos des artistes principaux
  let artistMargin = ymargin + 10;
  let artistWidth = (pageWidth - 2 * xmargin) / 3;
  let artistHeight = (artistWidth * 500) / 400;
  const artists = data.event?.ratedExpenses?.filter(e => e.ratedExpense?.ratedExpenseType?.id == 1)
  let i = 0
  let names = ""
  if (artists !== undefined) {
    for (const artist of artists) {
      doc.addImage(
        uploadDir + artist?.ratedExpense?.imageLink!,
        "JPEG",
        xmargin + i * (artistWidth + 5),
        artistMargin,
        artistWidth,
        artistHeight
      );
      names += artist?.ratedExpense?.name + ", "
      i++;
    }
  }
  names = names.substring(0, names.length - 2)
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(names, xmargin, artistMargin + artistHeight + 8);

  // Ajout du prix des places
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Places disponibles :", xmargin, artistMargin + artistHeight + 18);
  doc.setFontSize(16)
  doc.setFont("helvetica", "normal");
  i = 0
  for (const seat of data?.event?.eventSeatCategories!) {
    doc.text(seat.locationSeatCategory?.seatCategory?.name + " : " + String(formatNumber(seat.price)) + " Ar", xmargin, artistMargin + artistHeight + 28 + i * 8);
    i++;
  }
  // Enregistrement du document en tant que fichier PDF
  showInbrowser(doc, `Affiche ${data?.event?.name}.pdf`)
}

const showInbrowser = (doc: JsPDF, filename: string) => {
  let string = doc.output('datauristring', {filename: filename});
  let embed = "<embed width='100%' height='100%' src='" + string + "'/>"
  let x = window.open();
  x?.document.open();
  x?.document.write(embed);
  x?.document.close();
}
