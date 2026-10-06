
import "./like-analytics.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useVacations } from "../../../vacations-area/use-vacations/use-vacations";

type LikeChartProps = {
    data: { destination: string, likeCount: number }[];
}

function LikeChart(props: LikeChartProps) {
    return (
        <ResponsiveContainer width="100%" height={props.data.length * 40}>
            <BarChart data={props.data} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="destination" width={120} />
                <Tooltip />
                <Bar dataKey="likeCount" fill="#15222c" />
            </BarChart>
        </ResponsiveContainer>


    )

}

export function LikeAnalytics() {
    const { vacations, isLoading } = useVacations();
    const likeData = vacations.map(v => ({
        destination: v.destination,
        likeCount: v.likeCount!
    }));



    return (
        <div className="LikeAnalytics">

            <h1>Like Analytics</h1>
            <LikeChart data={likeData} />

            {isLoading && <span>Loading data...</span>}
        </div>
    );
}
