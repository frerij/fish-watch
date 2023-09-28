import L from "leaflet";
import marker from "./assets/dot.svg";

const IconDot = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  iconAnchor: undefined,
  popupAnchor: undefined,
  shadowUrl: undefined,
  shadowSize: [0, 0],
  shadowAnchor: [0, 0],
  iconSize: new L.Point(30, 30),
  className: "leaflet-div-icon__dot",
});

export { IconDot };
