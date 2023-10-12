import { useMemo, useState } from "react";
import speciesToTag from "../data/speciesToTag.json";

type SidebarProps = {
  setSelectedTag: (arg0: string) => void;
  selectedTag: string;
  setSelectedSpecies: (arg0: string) => void;
  selectedSpecies: string;
};
export function Sidebar({
  setSelectedTag,
  selectedTag,
  setSelectedSpecies,
  selectedSpecies,
}: SidebarProps) {
  const species = ["All", ...Object.keys(speciesToTag).sort()];
  const [tagInput, setTagInput] = useState("");
  const fishTagsToRender = useMemo(() => {
    if (selectedSpecies === "All") {
      return [
        "All",
        ...speciesToTag.Chinook,
        ...speciesToTag.Coho,
        ...speciesToTag.Steelhead,
        ...speciesToTag.Unknown,
      ];
    }
    return ["All", ...speciesToTag[selectedSpecies]];
  }, [selectedSpecies]);
  return (
    <div className="flex flex-row gap-y-5 gap-x-8 py-4 overflow-y-auto bg-darkerGrey px-6">
      {/* <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=white"
          alt="Your Company"
        />
      </div> */}
      <div className={`flex flex-1 flex-col gap-1`}>
        <div className="font-semibold text-md pb-2 text-white">Species</div>
        {species.map((s) => {
          return (
            <div
              key={s}
              onClick={() => setSelectedSpecies(s)}
              className={`${
                selectedSpecies === s
                  ? "bg-darkGrey text-white"
                  : "text-lightGrey hover:text-white hover:bg-darkGrey"
              } group flex gap-x-3 rounded-md p-2 text-md leading-6 font-bold cursor-pointer`}
            >
              {s}
            </div>
          );
        })}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="font-semibold text-md pb-2 text-white">
          Acoustic Tag
        </div>
        {fishTagsToRender.map((s) => {
          return (
            <div
              key={s}
              onClick={() => setSelectedTag(s)}
              className={`${
                selectedTag === s
                  ? "bg-darkGrey text-white"
                  : "text-lightGrey hover:text-white hover:bg-darkGrey"
              } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer`}
            >
              {s}
            </div>
          );
        })}
      </div>
    </div>
  );
}
