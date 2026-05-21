import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CoverLetterComponent from "@/features/coverletter/component/coverletter-component";
import CoverLetterOutput from "@/features/coverletter/component/coverletter-output";
import DetailsTabs from "@/shared/component/Tabs/DetailsTabs";

export function WorkspaceLayout() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="w-full h-full">
      <ResizablePanel
        style={{ overflow: "clip" }}
        defaultSize="35%"
        minSize={400}
      >
        <DetailsTabs />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="65%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <CoverLetterComponent />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="75%">
            <div className="flex h-full items-center justify-center p-6">
              <CoverLetterOutput />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
