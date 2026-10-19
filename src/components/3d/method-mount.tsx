"use client";

import dynamic from "next/dynamic";

/** Loaded on the client only, and only once the section is near. */
const MethodForms = dynamic(() => import("@/components/3d/lab/method-forms"), {
  ssr: false,
  loading: () => null,
});

export default function MethodMount() {
  return <MethodForms />;
}
