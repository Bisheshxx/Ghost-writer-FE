"use client";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Clipboard, ClipboardCheck } from "lucide-react";
import React, { useState } from "react";
import { useCoverLetterStore } from "../store/useCoverLetterStore";

export default function CoverLetterOutput() {
  const [isTextCopied, setIsTextCopied] = useState(false);
  const { coverLetter, isCoverLetterLoading, isCoverLetterError } =
    useCoverLetterStore();
  if (isCoverLetterLoading) return <Loading />;
  if (!isCoverLetterLoading && isCoverLetterError) return <>ERROR</>;
  if (coverLetter === null)
    return (
      <span className="font-semibold">The cover letter is generated here.</span>
    );

  const letter = `Bishesh Tuladhar
52 Bellville Drive, Clendon Park, Auckland
bishesh.priv@gmail.com
+64 22 043 8501
https://bisheshxx.vercel.app/

${coverLetter}

Thank you for your time and consideration.

Sincerely,
Bishesh Tuladhar`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setIsTextCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <div className="whitespace-pre-wrap text-sm relative">
      <Button
        variant={"outline"}
        onClick={handleCopy}
        className="absolute top-0 right-0 text-xs border rounded"
      >
        {isTextCopied ? <ClipboardCheck /> : <Clipboard />}
      </Button>
      {letter}
      {/* <div className="mb-4">
        <div>Bishesh Tuladhar</div>
        <div>Auckland, New Zealand</div>
        <div>bishesh.priv@gmail.com</div>
        <div>+64 22 043 8501</div>
      </div>
      {coverLetter}

      <div className="print:break-before-page mt-6">
        Thank you for your time and consideration.
      </div>
      <div className="print:break-before-page mt-6">Sincerely,</div>
      <div>Bishesh Tuladhar</div> */}
    </div>
  );
}
