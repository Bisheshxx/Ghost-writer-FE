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
        <CardTitle className="text-lg">Last bulk payload</CardTitle>
        <CardDescription>
          These are the selected company, job title, description, and location
          values that will be sent to the backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {payloads.map((payload) => (
          <div
            key={`${payload.company}-${payload.title}`}
            className="rounded-xl border bg-muted/40 p-3 text-sm"
          >
            <div className="font-medium text-foreground">
              {payload.company} - {payload.title}
            </div>
            <div className="mt-1 text-muted-foreground">
              {payload.location}
            </div>
            <p className="mt-2 line-clamp-2 text-muted-foreground">
              {payload.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
