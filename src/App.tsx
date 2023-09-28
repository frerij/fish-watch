import { useMemo, useState } from "react";
import "./App.css";
import json from "./data/data.json";
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
import { IconDot } from "./Icon";

function App() {
  const [input, setInput] = useState("");
  const collectedFishCount = collection.length;

  const { count, points } = useMemo(() => {
    let i = 0;
    const points: { location: number[]; mse: string }[] = [];
    json.forEach((row) => {
      if (row["Tag_code"] === input) {
        i++;
        points.push({ location: [row["lat"], row["lon"]], mse: row["MSE"] });
      }
    });
    return { count: i, points };
  }, [input]);

  const pointMarkers = useMemo(() => {
    return points.map((point) => {
      return (
        <CircleMarker
          pathOptions={{ fill: true, fillColor: "red", stroke: false }}
          radius={3}
          center={point.location}
          key={point.toString()}
        >
          <Popup>mse: {point.mse}</Popup>
        </CircleMarker>
      );
    });
  }, [points]);

  const uniqueFish = useMemo(() => {
    const fish: Record<string, boolean> = {};
    json.forEach((row) => {
      const tagCode = row["Tag_code"];
      if (!fish[tagCode]) {
        fish[tagCode] = true;
      }
    });
    return Object.keys(fish).length;
  }, []);

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
      <input
        type="text"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></input>
      <div>count: {count}</div>
      <div>unique fish: {uniqueFish}</div>
      <div>number of fish with acoustic tags: {tagCount}</div>
      <div>
        fish released: {fishCount} fish collected: {collectedFishCount}
      </div>
      <div>Types of fish: {speciesTypes}</div>
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
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {pointMarkers}
      </MapContainer>
    </>
  );
}

export default App;
