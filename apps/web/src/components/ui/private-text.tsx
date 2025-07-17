"use client";

import usePreferencesStore from "@/stores/preferences.store";
import React from "react";

export default function PrivateText({
  children,
  dots = 4,
  prefix = "",
}: {
  children: React.ReactNode;
  dots?: number;
  prefix?: string;
}) {
  const { hideBalances } = usePreferencesStore();

  return hideBalances ? prefix + "•".repeat(dots) : children;
}
