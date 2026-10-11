import "./like-analytics.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type LikeProps = {
    data: { destination: string, likeCount: number }[];
}

export function LikeChart(props: LikeProps) {
    return (
        <ResponsiveContainer width={800} height={400}>
            <BarChart data={props.data}>
                <XAxis dataKey="destination" interval={0} angle={-45} textAnchor="end" height={80} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="likeCount" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
        </ResponsiveContainer>


    )

}
