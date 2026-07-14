import React from "react";
import { Button } from "./ui/button";

interface IProps {
  title: string;
  handleAddClick?: () => void;
}

export default function PageTitle({ title, handleAddClick }: IProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center shrink-0">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}s
      </h2>
      {handleAddClick && (
        <Button onClick={handleAddClick} className="md:text-sm text-xs">
          Add {title}
        </Button>
      )}
    </div>
  );
}
