import speciesToTag from "./data/speciesToTag.json";

export type Species = keyof typeof speciesToTag;

export type Point = {
  dateTime: string;
  lat: number;
  lon: number;
  mse: string;
  x: string;
  y: string;
  z: string;
};
