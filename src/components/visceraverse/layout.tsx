'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import Header from './header';

export default function VisceraverseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [controls, main] = Array.isArray(children) ? children : [null, children];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>{controls}</SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        {main}
      </SidebarInset>
    </SidebarProvider>
  );
}
