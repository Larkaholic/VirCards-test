'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { SheetTitle } from '../ui/sheet';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="sm:hidden" />
        <Logo />
        <h1 className="text-xl font-headline font-bold hidden sm:block">
          VisceraVerse
        </h1>
      </div>
      <div className="flex-1" />
    </header>
  );
}
