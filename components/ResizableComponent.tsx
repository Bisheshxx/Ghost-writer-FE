import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import DetailsTabs from "@/shared/component/Tabs/DetailsTabs";

export function ResizableComponent() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize="35%" minSize={400}>
        {/* <div className="flex h-screen items-center justify-center p-6">
          <span className="font-semibold">Controls for the data</span>
        </div> */}
        <DetailsTabs />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="65%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">
                Where i add the jobs description
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="75%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">The Generated cover letter</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
