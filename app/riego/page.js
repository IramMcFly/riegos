"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";

// ⛔️ NO: import MapaRiegos from "@/components/MapaRiegos"
// ✅ SÍ: importación dinámica sin SSR
const MapaRiegos = dynamic(() => import("@/components/MapaRiegos"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Header />
      <MapaRiegos />
    </>
  );
}
