import React from "react";
import { Eye, EyeOff } from "lucide-react";
import usePreferencesStore from "@/stores/preferences.store";

export default function PrivacyToggle() {
  const { hideBalances, setHideBalances } = usePreferencesStore();

  return (
    <button
      className="flex items-center space-x-2 hover:cursor-pointer"
      onClick={() => setHideBalances(!hideBalances)}
    >
      {hideBalances ? <EyeOff /> : <Eye />}
    </button>
  );
}
