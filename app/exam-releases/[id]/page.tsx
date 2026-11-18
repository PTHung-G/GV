import { ReleaseWorkspace } from "@/components/grading/release-workspace";
export const metadata = {
  title: "Bộ mã đề đã chốt",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReleaseWorkspace releaseId={id} />;
}
