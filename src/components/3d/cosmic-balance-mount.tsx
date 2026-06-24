"use client";

import dynamic from "next/dynamic";

const CosmicBalance = dynamic(() => import("./cosmic-balance"), {
  ssr: false,
  loading: () => null,
});

export default function CosmicBalanceMount() {
  return <CosmicBalance />;
}
