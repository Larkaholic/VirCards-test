'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ThreeScene = dynamic(() => import('@/components/visceraverse/three-scene'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center"><Skeleton className="w-full h-full" /></div>,
});

export default function VisceraverseViewer() {
    return <ThreeScene />;
}
