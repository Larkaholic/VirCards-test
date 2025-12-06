import { AutopsyProvider } from '@/components/visceraverse/autopsy-provider';
import AutopsyControls from '@/components/visceraverse/autopsy-controls';
import Header from '@/components/visceraverse/header';
import { Logo } from '@/components/icons/logo';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import VisceraverseViewer from '@/components/visceraverse/visceraverse-viewer';

export default function Home() {
  return (
    <AutopsyProvider>
      <SidebarProvider>
        <div className="md:flex">
          <Sidebar className="h-screen flex-col">
            <SidebarHeader>
              <div className="flex items-center gap-3 p-2">
                <Logo />
                <h1 className="text-xl font-headline font-bold">VisceraVerse</h1>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
              <AutopsyControls />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="h-[calc(100vh-3.5rem)] bg-background">
              <VisceraverseViewer />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AutopsyProvider>
  );
}
