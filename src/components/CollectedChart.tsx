import release from "../data/data_release.json";
import collection from "../data/data_collection.json";
import { PieChart, Pie, Tooltip, Cell, Label } from "recharts";
import { useMemo } from "react";

export function CollectedChart() {
  const collectedFishCount = collection.length;

  const { fishCount } = useMemo(() => {
    const tagCodes: Record<string, boolean> = {};
    const fishTags: Record<string, boolean> = {};
    let tagCount = 0;
    let fishCount = 0;

    release.forEach((row) => {
      const fishTag = row["Tag Code"];
      const acousticTagShort = row["Acoustic Tag"];

      // if selectedSpecies === "All" do this way
      // otherwise, only count through the species selected

      if (acousticTagShort !== "" && !tagCodes[acousticTagShort]) {
        tagCodes[acousticTagShort] = true;
        tagCount++;
      }
      if (!fishTags[fishTag]) {
        fishTags[fishTag] = true;
        fishCount++;
      }
    });
    return { tagCount, fishCount };
  }, []);

  const data = [
    {
      name: "Collected Fish",
      value: collectedFishCount,
      fill: "blue",
    },
    {
      name: "Not Collected Fish",
      value: fishCount - collectedFishCount,
      fill: "yellow",
    },
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = 100;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
      <p>Proportion of fish collected:</p>
      <hr></hr>
      <PieChart width={275} height={200} className="max-w-10">
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx="50%"
          cy="50%"
          fill="#ffffff"
          outerRadius={80}
          label={renderCustomizedLabel}
        />
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={data[index].fill} />
        ))}
        <Tooltip />
      </PieChart>
    </>
  );
}
