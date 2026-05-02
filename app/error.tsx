"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { reset: resetQuery } = useQueryErrorResetBoundary();

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <AlertCircle size={100} className="text-red-500" />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-4">
          {error.message || "An error occurred"}
        </p>
        <Button
          onClick={() => {
            reset();
            resetQuery();
          }}
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
