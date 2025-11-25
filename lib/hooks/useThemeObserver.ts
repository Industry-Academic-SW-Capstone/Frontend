import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useThemeObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/pwa")) {
      document.body.classList.add("enable-dark-mode");
    } else {
      document.body.classList.remove("enable-dark-mode");
    }
  }, [pathname]);
}
