import { AutopsyProvider } from '@/components/visceraverse/autopsy-provider';
import AutopsyControls from '@/components/visceraverse/autopsy-controls';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import VisceraverseViewer from '@/components/visceraverse/visceraverse-viewer';
import { PanelLeft } from 'lucide-react';
import { Logo } from '@/components/icons/logo';

export default function Home() {
  return (
    <AutopsyProvider>
      <div className="relative h-screen w-screen bg-background">
        <header className="absolute top-0 left-0 z-10 p-4 flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <PanelLeft />
                <span className="sr-only">Toggle Controls</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[350px] sm:w-[400px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 p-4 border-b">
                  <Logo />
                  <h1 className="text-xl font-headline font-bold">VisceraVerse</h1>
                </div>
                <AutopsyControls />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="h-full w-full">
          <VisceraverseViewer />
        </main>
      </div>
    </AutopsyProvider>
  );
}
