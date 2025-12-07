import AutopsyControls from '@/components/visceraverse/autopsy-controls';
import VisceraverseLayout from '@/components/visceraverse/layout';
import VisceraverseViewer from '@/components/visceraverse/visceraverse-viewer';
import { AutopsyProvider } from '@/components/visceraverse/autopsy-provider';

export default function Home() {
  return (
    <AutopsyProvider>
      <VisceraverseLayout>
        <AutopsyControls />
        <main className="h-full w-full">
          <VisceraverseViewer />
        </main>
      </VisceraverseLayout>
    </AutopsyProvider>
  );
}
