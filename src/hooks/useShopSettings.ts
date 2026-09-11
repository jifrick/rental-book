import { useState, useEffect } from 'react';
import type { ShopSettings } from '../types/database';
import { getSettings, subscribeToStore } from '../lib/storageService';

export function useShopSettings(): ShopSettings {
  const [settings, setSettings] = useState<ShopSettings>(() => getSettings());

  useEffect(() => {
    return subscribeToStore(() => {
      setSettings(getSettings());
    });
  }, []);

  return settings;
}
