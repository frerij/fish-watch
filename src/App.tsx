import { useEffect, useMemo, useState, useTransition } from "react";
import "./App.css";
import fishMap from "./data/fishMap.json";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Polyline,
  ScaleControl,
} from "react-leaflet";
import { CollectedChart } from "./components/CollectedChart";
import { Sidebar } from "./components/Sidebar";
import speciesToTag from "./data/speciesToTag.json";
import { FullscreenSpinner } from "./components/FullscreenSpinner";
import { DepthChart } from "./components/DepthChart";
import { Species } from "./types";
import originPNG from "./assets/originMarker.png";

// blue and yellow for colorblind accessibility
// limited to leaflet color options - add hex to tailwind config
// to use elsewhere but hardcoded on legend
const collectedToColor = {
  true: "blue",
  false: "yellow",
};

// select number of points path trail shows
const numberOfPointsOnTrail = 15;

// interval used for timer
const playSpeed = 90;

function App() {
  const [input, setInput] = useState("All");
  const [selectedSpecies, setSelectedSpecies] = useState<Species | "All">(
    "All"
  );
  const [time, setTime] = useState(0);
  const [trailModeActive, setTrailModeActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

  // useMemo caches result between renders
  const maxTimeRange = useMemo(() => {
    let max = 0;
    selectedFishTags.forEach((tag) => {
      if (fishMap[tag]["positions"].length > max) {
        max = fishMap[tag]["positions"].length;
      }
    });
    return max;
  }, [selectedFishTags]);

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

    // setting max number of points to 10000 for individual fish or 20000
    // for showing all of species
    // sampling using random value
    const maxPointsToShow = showAllOfSpecies ? 20000 : 10000;
    const sampleValue = count > maxPointsToShow ? maxPointsToShow / count : 1;
    const sampledPoints = [];
    selectedFishTags.forEach((tag) => {
      fishMap[tag]["positions"].forEach((point: []) => {
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

  const { trails } = useMemo(() => {
    if (!trailModeActive) return { trails: [] };

    const trails = [];
    selectedFishTags.forEach((tag) => {
      const isFishActive = time < fishMap[tag]["positions"].length;
      let latestIndex: number = isFishActive
        ? time
        : fishMap[tag]["positions"].length - 1;
      let trail = [];
      for (let i = 0; i < numberOfPointsOnTrail && latestIndex - i >= 0; i++) {
        trail.push(fishMap[tag]["positions"][latestIndex - i]);
      }
      trails.push({ trail, isFishActive, collected: fishMap[tag].collected });
    });

    return {
      trails,
    };
  }, [selectedFishTags, time, trailModeActive]);

  const trailPolylines = useMemo(() => {
    return trails.map((trail) => {
      return (
        <>
          <Polyline
            pathOptions={{
              color: "black",
              opacity: trail.isFishActive ? 1 : 0.2,
              fill: false,
              weight: 5,
            }}
            positions={trail.trail.map((point) => [point.lat, point.lon])}
          />
          <Polyline
            pathOptions={{
              color: collectedToColor[trail.collected],
              opacity: trail.isFishActive ? 1 : 0.2,
              fill: false,
            }}
            positions={trail.trail.map((point) => [point.lat, point.lon])}
          />
        </>
      );
    });
  }, [trails]);

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

  useEffect(() => {
    while (time < maxTimeRange && isPlaying) {
      const timer = window.setInterval(() => {
        setTime(time + 1);
      }, playSpeed);
      return () => {
        window.clearInterval(timer);
      };
    }
  }, [isPlaying, maxTimeRange, time]);

  return (
    <>
      <div className="flex grow flex-row max-h-screen gap-10 min-h-screen">
        <Sidebar
          setSelectedTag={handleChangeInput}
          selectedTag={input}
          setSelectedSpecies={handleChangeSelectedSpecies}
          selectedSpecies={selectedSpecies}
        />
        {isLoading && <FullscreenSpinner />}
        <div className="max-h-screen grow overflow-y-scroll pt-10 flex flex-row gap-8">
          <div className="flex flex-col pb-10 gap-8">
            <div className="p-4 max-w-10">
              <h2 className="font-bold">Details</h2>
              <hr></hr>
              <div className="pl-2">
                <div>Tag Code: {input}</div>
                <div>
                  Species:
                  {fishMap?.[input]?.species
                    ? ` ${fishMap?.[input]?.species}`
                    : ` ${selectedSpecies}`}
                </div>
                <div>
                  Fish Collected: {fishMap?.[input]?.collected ? "Yes" : "No"}
                </div>
                <div>Number of Position Points: {count}</div>
                <div>Number of Position Points Displayed: {countDisplayed}</div>
              </div>
            </div>

            <div className="self-center">
              <CollectedChart />
            </div>
            <div className="p-4 max-w-10">
              <h2 className="font-bold">Legend</h2>
              <hr></hr>
              <div className="pl-2">
                <div className="flex flex-row pt-1">
                  <p>Origin:</p>
                  <img src={originPNG} className="h-6 w-4 ml-2"></img>
                </div>
                <div className="flex flex-row">
                  <p>Position point:</p>
                  <button
                    disabled={true}
                    className="bg-white w-4 h-4 rounded-full self-center ml-2"
                  ></button>
                </div>
                <div className="flex flex-row">
                  <p>Collected fish: </p>
                  <button
                    disabled={true}
                    className={`bg-blue w-8 h-4 self-center ml-2`}
                  ></button>
                </div>
                <div className="flex flex-row">
                  <p>Uncollected fish: </p>
                  <button
                    disabled={true}
                    className={`bg-yellow w-8 h-4 self-center ml-2`}
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <MapContainer
                center={[48.884804, -122.896847]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ minHeight: "60vh", minWidth: "50vw" }}
              >
                <ScaleControl position="bottomright" />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[48.88231415802141, -122.89835666919856]}>
                  <Popup>Selected origin point</Popup>
                  {pointMarkers}
                </Marker>
                {trailPolylines}
              </MapContainer>
            </div>
            <div>
              <div className="flex flex-row gap-6">
                <button
                  className={`${
                    trailModeActive
                      ? "bg-red hover:bg-red/70"
                      : "bg-green hover:bg-green/70"
                  } rounded-lg text-sm py-1 px-4 h-10 w-40 text-center self-center font-bold cursor-pointer text-white`}
                  onClick={() => {
                    if (trailModeActive) {
                      setIsPlaying(false);
                    }
                    setTrailModeActive(!trailModeActive);
                  }}
                >
                  {trailModeActive ? "Disable trail mode" : "Enable trail mode"}
                </button>
                <button
                  disabled={!trailModeActive}
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                  }}
                  className={`${
                    isPlaying && trailModeActive === true
                      ? "bg-red hover:bg-red/70 cursor-pointer"
                      : trailModeActive
                      ? "bg-green hover:bg-green/70 cursor-pointer"
                      : "bg-green cursor-not-allowed opacity-50"
                  } rounded-md px-2 text-xs font-bold text-white h-10 w-12`}
                >
                  {isPlaying ? "Stop" : "Start"}
                </button>
                <button
                  disabled={!trailModeActive}
                  onClick={() => {
                    setIsPlaying(false);
                    setTime(0);
                  }}
                  className={`${
                    trailModeActive
                      ? "bg-red hover:bg-red/70 cursor-pointer"
                      : "bg-red cursor-not-allowed opacity-50"
                  } rounded-md px-2 text-xs font-bold text-white h-10`}
                >
                  Reset
                </button>
                <div
                  className={`${
                    trailModeActive ? "" : "opacity-50"
                  } flex flex-col grow`}
                >
                  <label
                    htmlFor="timeRange"
                    className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                  >
                    Time range: {time}
                  </label>
                  <input
                    disabled={!trailModeActive}
                    type="range"
                    className={`${
                      trailModeActive ? "cursor-pointer" : "cursor-not-allowed"
                    } transparent h-1.5 grow appearance-none rounded-lg border-transparent bg-white`}
                    id="timeRange"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    min={0}
                    max={maxTimeRange}
                  />
                </div>
              </div>
            </div>
            {/* <div className="border-4 border-white rounded-md h-48">
              <h2>Depth graph placeholder</h2>
              <DepthChart />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
