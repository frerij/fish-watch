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
import speciesToTag from "./data/speciesToTag.json";
import { FullscreenSpinner } from "./components/FullscreenSpinner";

// chose blue and yellow for colorblind accessibility
const collectedToColor = {
  true: "blue",
  false: "yellow",
};

function App() {
  const [input, setInput] = useState("All");
  const [selectedSpecies, setSelectedSpecies] = useState("All");
  const collectedFishCount = collection.length;

  const [isLoading, startTransition] = useTransition();

  const selectedFishTags = useMemo(() => {
    let fishTags = [input];
    const showAllOfSpecies = input === "All";
    if (showAllOfSpecies) {
      if (selectedSpecies === "All") {
        fishTags = Object.keys(fishMap);
      } else {
        fishTags = speciesToTag[selectedSpecies];
      }
    }
    return fishTags;
  }, [input, selectedSpecies]);

  const { count, countDisplayed, points } = useMemo(() => {
    const showAllOfSpecies = input === "All";
    let count = 0;
    if (showAllOfSpecies) {
      selectedFishTags.forEach(
        (fishTag) => (count += fishMap[fishTag]["positions"].length)
      );
    } else {
      count = fishMap[input]["positions"].length;
    }

    // setting max number of points to 10000 for performance
    // sampling using random value
    const maxPointsToShow = showAllOfSpecies ? 20000 : 10000;
    const sampleValue = count > maxPointsToShow ? maxPointsToShow / count : 1;
    const sampledPoints = [];
    selectedFishTags.forEach((tag) => {
      fishMap[tag]["positions"].forEach((point) => {
        if (Math.random() <= sampleValue) {
          const fishCollected = fishMap[tag]["collected"];
          sampledPoints.push({ ...point, collected: fishCollected });
        }
      });
    });
    return {
      count: count,
      countDisplayed: sampledPoints.length,
      points: sampledPoints,
    };
  }, [input, selectedFishTags]);

  const pointMarkers = useMemo(() => {
    return points.map((point) => {
      return (
        <CircleMarker
          pathOptions={{
            fill: true,
            fillColor: collectedToColor[point.collected],
            stroke: false,
          }}
          radius={3}
          center={[point.lat, point.lon]}
          key={`${point.lat}${point.lon}${point.mse}`}
        >
          {/* <Popup>mse: {point.mse}</Popup> */}
        </CircleMarker>
      );
    });
  }, [points]);

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

  const handleChangeSelectedSpecies = (i: string) => {
    startTransition(() => {
      setSelectedSpecies(i);
      setInput("All");
    });
  };

  return (
    <>
      {isLoading && <FullscreenSpinner />}
      <div className="flex grow flex-row max-h-screen gap-10 min-h-screen">
        <Sidebar
          setSelectedTag={handleChangeInput}
          selectedTag={input}
          setSelectedSpecies={handleChangeSelectedSpecies}
          selectedSpecies={selectedSpecies}
        />

        <div className="max-h-screen grow overflow-y-scroll">
          <div className="flex flex-row gap-6">
            <div>
              fish released: {fishCount} fish collected: {collectedFishCount}
              <CollectedChart />
            </div>
          </div>
          <div className="flex flex-row pb-10">
            <div className="py-8 pr-4">
              <div>
                {input
                  ? `${input} is a ${fishMap?.[input]?.species}`
                  : "Select a fish"}
              </div>
              <div>
                Fish Collected: {fishMap?.[input]?.collected ? "Yes" : "No"}
              </div>
              <div>Number of Position Points: {count}</div>
              <div>Number of Position Points Displayed: {countDisplayed}</div>
            </div>
            <div className="max-w-lg ">
              <MapContainer
                center={[48.88231415802141, -122.89835666919856]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ minHeight: "60vh", minWidth: "50vw" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[48.88231415802141, -122.89835666919856]}>
                  <Popup>Selected origin point</Popup>
                </Marker>
                {pointMarkers}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
