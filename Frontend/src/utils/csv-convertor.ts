import { LikedVacations } from "../models/vacation-model";

class CsvConvertor {

    public convertToCsvString(data: LikedVacations[]): string {

        let csvString = "Destination,Likes\n";
        for (const prop of data) {
            csvString += `${prop.destination},${prop.likeCount}\n`
        }

        return csvString;
    }

    public download(csvString: string, fileName: string): void {
        const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }


}

export const csvConvertor = new CsvConvertor();