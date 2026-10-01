import { Suspense } from "react";
import { HomeShell } from "@/features/home/components/home-shell";
import { LoadingScreen } from "@/components/loading-screen";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomeShell />
    </Suspense>
  );
}
