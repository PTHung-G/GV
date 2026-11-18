import { ReleasePair } from "@/components/grading/release-workspace";
export const metadata = {
  title: "Kết nối chụp bộ đề",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <ReleasePair code={code} />;
}
