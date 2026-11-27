'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DeviceMode } from '@/types';

export const DEVICE_STORAGE_KEY = 'liderkids_device_mode';

interface DeviceModeContextType {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  isDeviceSelected: boolean;
  isDeviceSelectorOpen: boolean;
  openDeviceSelector: () => void;
  closeDeviceSelector: () => void;
  suggestedMode: DeviceMode;
}

const DeviceModeContext = createContext<DeviceModeContextType | undefined>(undefined);

function detectSuggestedMode(): DeviceMode {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

export function DeviceModeProvider({ children }: { children: React.ReactNode }) {
  const [deviceMode, setDeviceModeState] = useState<DeviceMode>('desktop');
  const [isDeviceSelected, setIsDeviceSelected] = useState<boolean>(true); // default true for SSR
  const [isDeviceSelectorOpen, setIsDeviceSelectorOpen] = useState<boolean>(false);
  const [suggestedMode, setSuggestedMode] = useState<DeviceMode>('desktop');

  // Sync DOM data-device attribute
  const applyDataAttribute = useCallback((mode: DeviceMode) => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-device', mode);
    document.body?.setAttribute('data-device', mode);
  }, []);

  // Initialize from localStorage and detect suggested mode
  useEffect(() => {
    const suggested = detectSuggestedMode();
    setSuggestedMode(suggested);

    try {
      const saved = localStorage.getItem(DEVICE_STORAGE_KEY) as DeviceMode | null;
      if (saved && (saved === 'mobile' || saved === 'tablet' || saved === 'desktop')) {
        setDeviceModeState(saved);
        setIsDeviceSelected(true);
        setIsDeviceSelectorOpen(false);
        applyDataAttribute(saved);
      } else {
        // Not selected yet: default to suggested mode, but open selector modal
        setDeviceModeState(suggested);
        setIsDeviceSelected(false);
        setIsDeviceSelectorOpen(true);
        applyDataAttribute(suggested);
      }
    } catch {
      setDeviceModeState(suggested);
      setIsDeviceSelected(false);
      setIsDeviceSelectorOpen(true);
      applyDataAttribute(suggested);
    }
  }, [applyDataAttribute]);

  const setDeviceMode = useCallback(
    (mode: DeviceMode) => {
      setDeviceModeState(mode);
      setIsDeviceSelected(true);
      setIsDeviceSelectorOpen(false);
      applyDataAttribute(mode);
      try {
        localStorage.setItem(DEVICE_STORAGE_KEY, mode);
      } catch (e) {
        console.warn('Failed to save device mode to localStorage:', e);
      }
    },
    [applyDataAttribute]
  );

  const openDeviceSelector = useCallback(() => {
    setIsDeviceSelectorOpen(true);
  }, []);

  const closeDeviceSelector = useCallback(() => {
    // Only allow closing if a device has already been selected
    if (isDeviceSelected) {
      setIsDeviceSelectorOpen(false);
    }
  }, [isDeviceSelected]);

  return (
    <DeviceModeContext.Provider
      value={{
        deviceMode,
        setDeviceMode,
        isDeviceSelected,
        isDeviceSelectorOpen,
        openDeviceSelector,
        closeDeviceSelector,
        suggestedMode,
      }}
    >
      {children}
    </DeviceModeContext.Provider>
  );
}

export function useDeviceMode() {
  const context = useContext(DeviceModeContext);
  if (!context) {
    throw new Error('useDeviceMode must be used within a DeviceModeProvider');
  }
  return context;
}
