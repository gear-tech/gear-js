import { useState, useEffect } from 'react';

import { type GearComponentsType } from './gear-components';
import { type VaraComponentsType } from './vara-components';

type UiComponentSet = VaraComponentsType | GearComponentsType;

export type ThemeName = 'gear' | 'vara';

const loadedKits: Partial<Record<ThemeName, Promise<UiComponentSet>>> = {};

function loadUiKit(theme: ThemeName): Promise<UiComponentSet> {
  if (loadedKits[theme]) {
    return loadedKits[theme];
  }

  const importPromise =
    theme === 'gear'
      ? import('./gear-components').then((module) => module.default)
      : import('./vara-components').then((module) => module.default);

  loadedKits[theme] = importPromise;

  importPromise.catch((error) => {
    console.error(`Failed to load UI kit "${theme}":`, error);
    delete loadedKits[theme];
  });

  return importPromise;
}

interface UseUiKitResult {
  components: UiComponentSet | null;
  isLoading: boolean;
}

const resolvedComponentsCache: Partial<Record<ThemeName, UiComponentSet>> = {};

export function useUiKit(theme: ThemeName): UseUiKitResult {
  const components = resolvedComponentsCache[theme] || null;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (components) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadUiKit(theme)
      .then((loadedComponents) => {
        resolvedComponentsCache[theme] = loadedComponents;
      })
      .catch((loadError) => {
        console.error(`Error loading UI kit "${theme}":`, loadError);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return { components, isLoading };
}
