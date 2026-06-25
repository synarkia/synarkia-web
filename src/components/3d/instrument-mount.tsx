"use client";

import dynamic from "next/dynamic";

const Instrument = dynamic(() => import("./instrument"), {
  ssr: false,
  loading: () => null,
});

export default function InstrumentMount({ variant = "core" }: { variant?: "core" | "studio" | "labs" }) {
  return <Instrument variant={variant} />;
}
