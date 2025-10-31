import { useEffect } from "react";
import { useUser } from "@/use.store";

export function useSyncLogout() {
  const setUser = useUser((s) => s.setUser);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === "user-storage") {
        const value = event.newValue;
        if (!value) {
          // Logout ocorreu em outra aba
          setUser(null);
        }
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setUser]);
}
