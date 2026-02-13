"use client";

import { useLenisInit } from "@/hooks/use-smooth-scroll";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenisInit();
  return <>{children}</>;
}
