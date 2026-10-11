
import "./like-analytics.css";

import { useVacations } from "../../../vacations-area/use-vacations/use-vacations";
import { notify } from "../../../../utils/notify";
import { csvConvertor } from "../../../../utils/csv-convertor";
import { LikeChart } from "./like-chart";
import { LikedVacations } from "../../../../models/vacation-model";


export function LikeAnalytics() {
    const { vacations, isLoading } = useVacations();
    const likeData = vacations.map(v => ({
        destination: v.destination,
        likeCount: v.likeCount!
    })) as LikedVacations[];

    function downloadCsv() {

        try {
        
            const csvString = csvConvertor.convertToCsvString(likeData);
            console.log(csvString);
            csvConvertor.download(csvString, "like-analytics.csv");

        }
        catch (err: any) {
            notify.error(err);
        }

    }

    return (
        <div className="LikeAnalytics">

            <h1>Like Analytics</h1>
            <LikeChart data={likeData} />
            <button onClick={() => downloadCsv()}>Dowload csv like analytics</button>
            {isLoading && <span>Loading data...</span>}
        </div>
    );
}
