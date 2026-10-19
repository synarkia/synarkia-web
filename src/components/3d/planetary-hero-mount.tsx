"use client";

import dynamic from "next/dynamic";

const PlanetaryHero = dynamic(
  () => import("@/components/3d/lab/planetary-reach").then((m) => m.PlanetaryHero),
  { ssr: false, loading: () => null }
);

export default function PlanetaryHeroMount() {
  return <PlanetaryHero />;
}
