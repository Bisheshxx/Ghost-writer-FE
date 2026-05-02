import { ApiErrorHandler } from "@/lib/axios/Api-Error-Handler";
import { Ghost } from "lucide-react";
import React from "react";

export default function ErrorFallBack({ error }: { error: ApiErrorHandler }) {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <Ghost size={100} />
        <span className="font-bold mt-2">
          {error?.message || "Something went wrong!"}
        </span>
      </div>
    </div>
  );
}
