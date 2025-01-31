import { useEffect, useState } from "react";

/**
 * Hook that tracks the state of a CSS media query.
 */
export function useMedia(query: string) {
  const isBrowser = typeof window !== "undefined";
  const [state, setState] = useState(() => {
    if (isBrowser) {
      return window.matchMedia(query).matches;
    }
    return false;
  });
  const listener = (event: MediaQueryListEvent): void =>
    setState(event.matches);

  useEffect(() => {
    let mqList: MediaQueryList | null = null;

    if (isBrowser) {
      setState(window.matchMedia(query).matches);
      mqList = window.matchMedia(query);

      try {
        mqList.addEventListener("change", listener); // Chrome & Firefox
      } catch (_e1) {
        try {
          mqList.addListener(listener); // Safari
        } catch (e2) {
          console.error(e2);
        }
      }
    }

    return () => {
      if (mqList) {
        try {
          mqList.removeEventListener("change", listener); // Chrome & Firefox
        } catch (_e1) {
          try {
            mqList.removeListener(listener); // Safari
          } catch (e2) {
            console.log(e2);
          }
        }
      }
    };
  }, [query]);

  return state;
}

export const useIsMobile = () => useMedia("(min-width: 475px)");
export const useIsTablet = () => useMedia("(min-width: 768px)");
export const useIsTabletLg = () => useMedia("(min-width: 1024px)");
export const useIsXl = () => useMedia("(min-width: 1280px)");
export const useIs2Xl = () => useMedia("(min-width: 1440px)");
export const useIs3Xl = () => useMedia("(min-width: 1920px)");
