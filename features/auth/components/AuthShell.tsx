import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export default function AuthShell({
  children,
  description,
  title,
}: AuthShellProps) {
  return (
    <main className="min-h-screen w-full bg-background">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[1fr_440px]">
        <div className="hidden flex-col justify-between border-r bg-muted/30 px-10 py-8 lg:flex">
          <div className="text-sm font-semibold tracking-wide">Ghost Writer</div>
          <div className="max-w-xl space-y-5">
            <p className="text-4xl font-semibold leading-tight">
              Build focused application material from your experience.
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Keep your resume details, project history, skills, and cover
              letter drafts in one private workspace.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Authenticated workspace for resume and cover letter generation.
          </p>
        </div>

        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-wide lg:hidden">
                Ghost Writer
              </p>
              <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
