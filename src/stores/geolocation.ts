import { create } from "zustand";

export interface Geolocation {
  _id?: string;
  userId: string;
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  readme: string;
}

interface GeolocationState {
  selectedGeolocation: Geolocation | null;
  setSelectedGeolocation: (geolocation: Geolocation) => void;
  clearSelectedGeolocation: () => void;
}

export const useGeolocation = create<GeolocationState>((set) => ({
  selectedGeolocation: null,
  setSelectedGeolocation: (geolocation) =>
    set({ selectedGeolocation: geolocation }),
  clearSelectedGeolocation: () => set({ selectedGeolocation: null }),
}));
