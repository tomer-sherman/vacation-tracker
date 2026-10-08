
import "./like-analytics.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useVacations } from "../../../vacations-area/use-vacations/use-vacations";

type LikeChartProps = {
    data: { destination: string, likeCount: number }[];
}

function LikeChart(props: LikeChartProps) {
    return (
        <ResponsiveContainer width={800} height={400}>
            <BarChart data={props.data}>
                <XAxis dataKey="destination" interval={0} angle={-45} textAnchor="end" height={80} />
                <YAxis allowDecimals={false}  />
                <Tooltip />
                <Bar dataKey="likeCount" radius={[4, 4, 0, 0]} maxBarSize={20} />
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
