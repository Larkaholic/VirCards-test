import { AutopsyProvider } from '@/components/visceraverse/autopsy-provider';
import AutopsyControls from '@/components/visceraverse/autopsy-controls';
import Header from '@/components/visceraverse/header';
import { Logo } from '@/components/icons/logo';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ThreeScene = dynamic(() => import('@/components/visceraverse/three-scene'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center"><Skeleton className="w-full h-full" /></div>,
});

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
              <ThreeScene />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AutopsyProvider>
  );
}
