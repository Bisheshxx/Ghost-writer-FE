import { SquareDashedText } from "lucide-react";
import React from "react";

export default function NothingToDisplay() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <SquareDashedText size={100} />
      <span className="font-bold mt-2">Nothing to display</span>
    </div>
  );
}
