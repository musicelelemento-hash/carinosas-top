"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Target, RefreshCw } from "lucide-react";

// Dynamic imports to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => ({ default: mod.useMapEvents })),
  { ssr: false }
) as any;

import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number, address?: string) => void;
  cityCenter?: [number, number];
}

// Inner component that handles map clicks
function ClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  // We need to use the hook pattern from react-leaflet
  // But since it's dynamically imported we do it inline
  const [MapEvents, setMapEvents] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapEvents(() => mod.useMapEvents);
    });
  }, []);

  if (!MapEvents) return null;

  return <MapEventsInner useMapEvents={MapEvents} onMapClick={onMapClick} />;
}

function MapEventsInner({
  useMapEvents,
  onMapClick,
}: {
  useMapEvents: any;
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e: any) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({
  lat,
  lng,
  onChange,
  cityCenter,
}: LocationPickerMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);
  const [reversedAddress, setReversedAddress] = useState<string>("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [useMapEventsHook, setUseMapEventsHook] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
    import("react-leaflet").then((mod) => {
      setUseMapEventsHook(() => mod.useMapEvents);
    });
  }, []);

  // Reverse geocoding using nominatim (free, no API key)
  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      setIsGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`,
          { headers: { "Accept-Language": "es" } }
        );
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(", ").slice(0, 4).join(", ");
          setReversedAddress(parts);
          onChange(latitude, longitude, parts);
        } else {
          onChange(latitude, longitude);
        }
      } catch {
        onChange(latitude, longitude);
      } finally {
        setIsGeocoding(false);
      }
    },
    [onChange]
  );

  const handleMapClick = useCallback(
    (newLat: number, newLng: number) => {
      reverseGeocode(newLat, newLng);
    },
    [reverseGeocode]
  );

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        },
        () => alert("No se pudo obtener tu ubicación.")
      );
    }
  };

  const customIcon =
    L && isClient
      ? new L.DivIcon({
          html: `<div style="
          width: 36px; 
          height: 36px; 
          background: radial-gradient(circle, rgba(212,175,55,0.9) 0%, rgba(212,175,55,0.3) 70%, transparent 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid #D4AF37;
          box-shadow: 0 0 20px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: #050505;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>`,
          className: "custom-pin-icon",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        })
      : null;

  const mapCenter: [number, number] =
    lat && lng ? [lat, lng] : cityCenter || [-1.8312, -78.1834];

  if (!isClient) {
    return (
      <div className="w-full h-64 bg-brand-black/40 rounded-2xl flex items-center justify-center border border-white/5">
        <div className="flex flex-col items-center gap-3 text-brand-white/30">
          <MapPin size={24} className="animate-pulse" />
          <span className="text-[10px] uppercase font-black tracking-widest">
            Cargando Mapa...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Controls Row */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-brand-gold/60 uppercase font-black tracking-widest flex items-center gap-2">
          <Target size={12} />
          Haz clic en el mapa para posicionar
        </label>
        <button
          type="button"
          onClick={handleMyLocation}
          className="flex items-center gap-2 text-[9px] text-brand-gold uppercase font-black tracking-wider px-3 py-1.5 rounded-xl border border-brand-gold/20 hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all"
        >
          <Navigation size={10} />
          Mi ubicación
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-brand-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
          zoomControl={true}
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Click handler using dynamic import pattern */}
          {useMapEventsHook && (
            <MapEventsComponent
              useMapEvents={useMapEventsHook}
              onMapClick={handleMapClick}
            />
          )}

          {lat && lng && customIcon && (
            <Marker position={[lat, lng]} icon={customIcon} />
          )}
        </MapContainer>

        {/* Overlay instructions */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-brand-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <p className="text-[8px] text-brand-gold/60 font-black uppercase tracking-widest">
            Click en el mapa = nueva posición
          </p>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-premium border-brand-gold/5 rounded-xl px-4 py-2">
          <span className="text-[7px] text-white/20 uppercase font-black block mb-0.5">
            Latitud
          </span>
          <span className="text-xs text-brand-gold font-mono">
            {lat ? lat.toFixed(6) : "—"}
          </span>
        </div>
        <div className="glass-premium border-brand-gold/5 rounded-xl px-4 py-2">
          <span className="text-[7px] text-white/20 uppercase font-black block mb-0.5">
            Longitud
          </span>
          <span className="text-xs text-brand-gold font-mono">
            {lng ? lng.toFixed(6) : "—"}
          </span>
        </div>
      </div>

      {/* Reverse Geocoded Address */}
      {(reversedAddress || isGeocoding) && (
        <div className="flex items-start gap-2 p-3 glass-premium border-brand-gold/10 rounded-xl animate-in slide-in-from-top-2">
          {isGeocoding ? (
            <RefreshCw size={12} className="text-brand-gold animate-spin mt-0.5 flex-shrink-0" />
          ) : (
            <MapPin size={12} className="text-brand-gold mt-0.5 flex-shrink-0" />
          )}
          <p className="text-[10px] text-brand-white/60 italic">
            {isGeocoding ? "Obteniendo dirección..." : reversedAddress}
          </p>
        </div>
      )}
    </div>
  );
}

// Separate component for map events to avoid hook rules violations
function MapEventsComponent({
  useMapEvents,
  onMapClick,
}: {
  useMapEvents: any;
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e: any) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
