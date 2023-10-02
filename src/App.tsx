import { useMemo, useState, useTransition } from "react";
import "./App.css";
import fishMap from "./data/fishMap.json";
import collection from "./data/data_collection.json";
import release from "./data/data_release.json";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { CollectedChart } from "./components/CollectedChart";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [input, setInput] = useState("");
  const collectedFishCount = collection.length;

  const [isLoading, startTransition] = useTransition();

  const { count, countDisplayed, points } = useMemo(() => {
    if (!fishMap[input] || !fishMap[input]["positions"])
      return { count: 0, points: [] };

    const count = fishMap[input]["positions"].length;
    // setting max number of points to 10000 for performance
    // sampling using random value
    const sampleValue = count > 10000 ? 10000 / count : 1;
    const sampledPoints = [];
    fishMap[input]["positions"].forEach((point) => {
      if (Math.random() <= sampleValue) {
        sampledPoints.push(point);
      }
    });
    return {
      count: fishMap[input]["positions"].length,
      countDisplayed: sampledPoints.length,
      points: sampledPoints,
    };
  }, [input]);

  const fishCodes = Object.keys(fishMap);
  const speciesColor = {
    Coho: "purple",
    Chinook: "green",
    Steelhead: "blue",
    unknown: "red",
  };

  const pointMarkers = useMemo(() => {
    return points.map((point) => {
      return (
        <CircleMarker
          pathOptions={{ fill: true, fillColor: "red", stroke: false }}
          radius={3}
          center={[point.lat, point.lon]}
          key={`${point.lat}${point.lon}${point.mse}`}
        >
          {/* <Popup>mse: {point.mse}</Popup> */}
        </CircleMarker>
      );
    });
  }, [points]);

  const speciesTypes = useMemo(() => {
    const species: Array<string> = [];
    release.forEach((row) => {
      const name = row["Species Name"];
      if (!species.includes(name)) {
        species.push(name);
      }
    });
    return species;
  }, []);

  const { tagCount, fishCount } = useMemo(() => {
    const tagCodes: Record<string, boolean> = {};
    const fishTags: Record<string, boolean> = {};
    let tagCount = 0;
    let fishCount = 0;

    release.forEach((row) => {
      const fishTag = row["Tag Code"];
      const acousticTagShort = row["Acoustic Tag"];
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

  const handleChangeInput = (i: string) => {
    startTransition(() => {
      setInput(i);
    });
  };

  return (
    <>
      <div className="flex grow flex-row max-h-screen gap-10 min-h-screen">
        <Sidebar setSelectedTag={handleChangeInput} selectedTag={input} />

        <div className="max-h-screen grow overflow-y-scroll">
          <div className="py-8">
            {isLoading && "LOADING"}

            <div>
              {input} is a {fishMap?.[input]?.["species"]}
            </div>
            <div>Number of Position Points: {count}</div>
            <div>Number of Position Points Displayed: {countDisplayed}</div>
          </div>
          <div>
            fish released: {fishCount} fish collected: {collectedFishCount}
            <CollectedChart />
          </div>
          <MapContainer
            center={[47.609946, -122.255315]}
            zoom={16}
            scrollWheelZoom={false}
            style={{ minHeight: "50vh", minWidth: "60vw" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[47.609946, -122.255315]}>
              <Popup>Selected origin point</Popup>
            </Marker>
            {pointMarkers}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default App;
