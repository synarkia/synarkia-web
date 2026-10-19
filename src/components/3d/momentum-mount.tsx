"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useLang } from "@/i18n/language-provider";

const load = () => import("@/components/3d/lab/momentum");
const Momentum = dynamic(load, { ssr: false, loading: () => null });

export default function MomentumMount({ intro }: { intro?: React.ReactNode }) {
  const { t } = useLang();

  // Pull the scene's code down as soon as the page is idle, long before it is
  // needed. Arriving at speed should never land on an empty frame.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const warm = () => { void load(); };
    if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(warm);
    else setTimeout(warm, 1200);
  }, []);

  return <Momentum intro={intro} labels={t.home.momentum} />;
}
