import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (date: number) => {
    return format(new Date(date), "dd MMMM yyyy",{locale: fr});
}

export const formatNumber = (number?: number,minimumFractionDigits=2) => {
    return number?.toLocaleString("en-Us", { minimumFractionDigits: 2, maximumFractionDigits: 2}).replaceAll(",", " ").replace(".", ",");
}
