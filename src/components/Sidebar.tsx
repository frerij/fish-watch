import { useState } from "react";
import speciesToTag from "../data/speciesToTag.json";

type SidebarProps = {
  setSelectedTag: (arg0: string) => void;
  selectedTag: string;
};
export function Sidebar({ setSelectedTag, selectedTag }: SidebarProps) {
  const species = Object.keys(speciesToTag);
  const [selectedSpecies, setSelectedSpecies] = useState(species[0]);
  return (
    <div className="flex flex-row gap-y-5 gap-x-8 py-4 overflow-y-auto bg-indigo-600 px-6">
      {/* <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=white"
          alt="Your Company"
        />
      </div> */}
      <div className={`flex flex-1 flex-col gap-1`}>
        {species.map((s) => {
          return (
            <div
              onClick={() => setSelectedSpecies(s)}
              className={`${
                selectedSpecies === s
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-700"
              } group flex gap-x-3 rounded-md p-2 text-md leading-6 font-bold`}
            >
              {s}
            </div>
          );
        })}
      </div>
      <div className="flex flex-1 flex-col pt-2">
        <div className="font-semibold text-md">Acoustic Tag</div>
        {speciesToTag[selectedSpecies].map((s) => {
          return (
            <div
              onClick={() => setSelectedTag(s)}
              className={`${
                selectedTag === s
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-700"
              } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
            >
              {s}
            </div>
          );
        })}
      </div>
    </div>
  );
}
