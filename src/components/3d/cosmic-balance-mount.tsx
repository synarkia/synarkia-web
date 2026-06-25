"use client";

import dynamic from "next/dynamic";

const Constellation = dynamic(() => import("./constellation"), {
  ssr: false,
  loading: () => null,
});

export default function CosmicBalanceMount() {
  return <Constellation />;
}
