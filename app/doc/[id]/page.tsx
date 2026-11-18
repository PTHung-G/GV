import type { Metadata } from 'next';
import { EditorWorkspace } from '@/components/editor/editor-workspace';

export const metadata: Metadata = {
  title: 'Trình soạn đề',
  robots: { index: false, follow: false },
};

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="editor-shell flex h-dvh flex-col overflow-hidden bg-surface-2">
      <EditorWorkspace docId={id} />
    </div>
  );
}
