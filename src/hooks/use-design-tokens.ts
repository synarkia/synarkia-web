"use client";

import { useMemo } from "react";
import * as THREE from "three";

// Hardcoded fallbacks matching globals.css
export const TOP_TIER_COLORS = {
  void: "#0C0A12",
  deepInk: "#141020",
  twilight: "#1C1830",
  lavender: "#B8A9E8",
  saffron: "#E8B84A",
  cream: "#FFFFFF",
  stone: "#C8BFB0",
};

export function useDesignTokens() {
  return useMemo(() => {
    return {
      void: new THREE.Color(TOP_TIER_COLORS.void),
      deepInk: new THREE.Color(TOP_TIER_COLORS.deepInk),
      twilight: new THREE.Color(TOP_TIER_COLORS.twilight),
      lavender: new THREE.Color(TOP_TIER_COLORS.lavender),
      saffron: new THREE.Color(TOP_TIER_COLORS.saffron),
      cream: new THREE.Color(TOP_TIER_COLORS.cream),
      stone: new THREE.Color(TOP_TIER_COLORS.stone),
    };
  }, []);
}
