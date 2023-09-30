import { useMemo, useState, startTransition } from "react";
import "./App.css";
import fishMap from "./data/fishMap.json";
import collection from "./data/data_collection.json";
import release from "./data/data_release.json";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";

function App() {
  const [input, setInput] = useState("");
  const collectedFishCount = collection.length;

  const { count, points } = useMemo(() => {
    if (!fishMap[input] || !fishMap[input]["positions"])
      return { count: 0, points: [] };

    return {
      count: fishMap[input]["positions"].length,
      points: fishMap[input]["positions"],
    };
  }, [input]);

  const fishCodes = Object.keys(fishMap);

  const pointMarkers = useMemo(() => {
    return points.map((point) => {
      return (
        <CircleMarker
          pathOptions={{ fill: true, fillColor: "red", stroke: false }}
          radius={3}
          center={[point.lat, point.lon]}
          key={`${point.lat}${point.lon}${point.mse}`}
        >
          <Popup>mse: {point.mse}</Popup>
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

  return (
    <>
      <div className="flex flex-row gap-10">
        <div className="justify-start bg-stone-900 h-full w-60 text-stone-60">
          <div>
            <span>Species</span>
            <div>
              {speciesTypes.map((speciesName) => {
                return (
                  <button
                    className="h-6 px-2 m-1 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700  focus:shadow-outline hover:bg-indigo-800"
                    id="speciesButton"
                    key={speciesName}
                  >
                    {speciesName}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <span>Acoustic Tag Code</span>
            <div className="0 flex flex-col items-center justify-start">
              {fishCodes.map((fishCode) => {
                return (
                  <button
                    className="h-6 px-2 m-1 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700  focus:shadow-outline hover:bg-indigo-800"
                    id="fishCodeButton"
                    onClick={() => {
                      startTransition(() => {
                        setInput(fishCode);
                      });
                    }}
                    key={fishCode}
                  >
                    {fishCode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="">
          <input
            type="text"
            onChange={(e) => {
              startTransition(() => {
                setInput(e.target.value);
              });
            }}
            value={input}
          ></input>
          <div>Number of Position Points: {count}</div>
          <div>number of fish with acoustic tags: {tagCount}</div>
          <div>
            fish released: {fishCount} fish collected: {collectedFishCount}
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
