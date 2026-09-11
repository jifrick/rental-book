import { useState, useEffect } from 'react';
import type { ShopSettings } from '../types/database';
import { getSettings, subscribeToStore } from '../lib/storageService';

export function useShopSettings(shopId?: string): ShopSettings {
  const [settings, setSettings] = useState<ShopSettings>(() => getSettings(shopId));

  useEffect(() => {
    setSettings(getSettings(shopId));
    return subscribeToStore(() => {
      setSettings(getSettings(shopId));
    });
  }, [shopId]);

  return settings;
}
