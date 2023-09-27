import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import json from "./data.json";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

function App() {
  const [input, setInput] = useState("");
  const count = useMemo(() => {
    let i = 0;
    json.forEach((row) => {
      if (row["Tag_code"] === input) {
        i++;
      }
    });
    return i;
  }, [input]);

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

  return (
    <>
      <input
        type="text"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></input>
      <div>count: {count}</div>
      <div>unique fish: {uniqueFish}</div>
      <MapContainer
        center={[47.609946, -122.255315]}
        zoom={13}
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
        <Marker position={[json[0]["lat"], json[0]["lon"]]} />
        <Marker position={[json[5]["lat"], json[5]["lon"]]} />
        <Marker position={[json[10]["lat"], json[10]["lon"]]} />
        <Marker position={[json[10000]["lat"], json[10000]["lon"]]} />
        <Marker position={[json[1000000]["lat"], json[1000000]["lon"]]} />
      </MapContainer>
    </>
  );
}

export default App;
