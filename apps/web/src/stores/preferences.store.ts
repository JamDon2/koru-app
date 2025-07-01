import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesStore {
  hideBalances: boolean;
  setHideBalances: (hideBalances: boolean) => void;
  _hasHydrated: boolean;
  _setHasHydrated: (state: boolean) => void;
}

const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      hideBalances: false,
      setHideBalances: (hideBalances: boolean) => {
        set({ hideBalances });
      },
      _hasHydrated: false,
      _setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "preferences-storage",
      onRehydrateStorage: (state) => {
        return () => state._setHasHydrated(true);
      },
    }
  )
);

export default usePreferencesStore;
