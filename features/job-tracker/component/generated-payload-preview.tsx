import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { GeneratedPayload } from "../types/job-tracker";

type GeneratedPayloadPreviewProps = {
  payloads: GeneratedPayload[];
};

export default function GeneratedPayloadPreview({
  payloads,
}: GeneratedPayloadPreviewProps) {
  if (payloads.length === 0) return null;

  return (
    <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">Generated documents</CardTitle>
        <CardDescription>
          Resume and cover letter text returned by the backend generation run.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {payloads.map((payload) => (
          <div
            key={`${payload.jobId}-${payload.createdAt}`}
            className="grid gap-3 rounded-xl border bg-muted/40 p-3 text-sm"
          >
            <div className="font-medium text-foreground">
              Job {payload.jobId}
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <GeneratedDocumentBlock title="Resume" text={payload.resumeText} />
              <GeneratedDocumentBlock
                title="Cover letter"
                text={payload.coverLetterText}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Model: {payload.model}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GeneratedDocumentBlock({
  text,
  title,
}: {
  text: string;
  title: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border bg-background/70 p-3">
      <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
        {title}
      </div>
      <p className="line-clamp-6 whitespace-pre-wrap text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
