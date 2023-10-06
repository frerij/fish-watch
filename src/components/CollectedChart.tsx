import release from "../data/data_release.json";
import collection from "../data/data_collection.json";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

export function CollectedChart() {
  const data = [
    { name: "Collected Fish", value: 356 },
    { name: "Not Collected Fish", value: 5000 },
  ];

  const colors = ["#0088FE", "#FF8042"];
  const radian = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * radian);
    const y = cy + radius * Math.sin(-midAngle * radian);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <PieChart width={400} height={400} className="">
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
          className="border border-rose-200"
        />
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
        <Tooltip />
      </PieChart>
    </>
  );
}
