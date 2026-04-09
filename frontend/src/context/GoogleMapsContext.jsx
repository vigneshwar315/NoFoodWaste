/**
 * GoogleMapsContext.jsx
 *
 * Loads the Google Maps JS SDK exactly once for the entire app.
 * All components that need `isLoaded` can call `useGoogleMaps()` instead
 * of calling `useJsApiLoader` individually (which causes re-init conflicts
 * when multiple components share the same loader id).
 */
import { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

// Keep the libraries array OUTSIDE the component so the reference is stable
// across renders — otherwise the hook treats it as "changed" every render
// and spams re-loads.
const LIBRARIES = ['places'];

const GoogleMapsContext = createContext({ isLoaded: false });

export function GoogleMapsProvider({ children }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

/** Use this in any component that needs to know whether Google Maps is ready. */
export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}
