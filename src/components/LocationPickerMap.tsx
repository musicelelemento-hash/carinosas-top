"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Navigation, Target, RefreshCw } from "lucide-react";

// ── All react-leaflet imports are STATIC here (this file is client-only via "use client")
// ── We guard rendering with an `isClient` check, so SSR never executes Leaflet code.
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number, address?: string) => void;
  cityCenter?: [number, number];
}

// ---------------------------------------------------------------------------
// MapClickHandler — must be rendered inside <MapContainer>
// Uses useMapEvents (hook) which is only valid inside a MapContainer tree.
// ---------------------------------------------------------------------------
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  // Imported at module level so TypeScript is happy; Leaflet never runs on the server
  // because the parent component gate-keeps with isClient.
  const { useMapEvents } = require("react-leaflet"); // eslint-disable-line @typescript-eslint/no-var-requires
  useMapEvents({
    click(e: any) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function LocationPickerMap({
  lat,
  lng,
  onChange,
  cityCenter,
}: LocationPickerMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [LeafletLib, setLeafletLib] = useState<any>(null);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
  } | null>(null);
  const [reversedAddress, setReversedAddress] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load Leaflet and react-leaflet dynamically only on client
    Promise.all([
      import("leaflet"),
      import("react-leaflet"),
    ]).then(([leaflet, rl]) => {
      setLeafletLib(leaflet.default || leaflet);
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
      });
    });
  }, []);

  // Reverse geocoding via Nominatim (free, no API key needed)
  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      setIsGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`
        );
        const data = await res.json();
        if (data?.display_name) {
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

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
        () => alert("No se pudo obtener tu ubicación.")
      );
    }
  };

  // Gold pin icon built with Leaflet DivIcon
  const customIcon =
    LeafletLib && isClient
      ? new LeafletLib.DivIcon({
          html: `<div style="
            width:36px;height:36px;
            background:radial-gradient(circle,rgba(212,175,55,.9) 0%,rgba(212,175,55,.3) 70%,transparent 100%);
            border-radius:50% 50% 50% 0;transform:rotate(-45deg);
            border:2px solid #D4AF37;
            box-shadow:0 0 20px rgba(212,175,55,.6),0 0 40px rgba(212,175,55,.2);
            display:flex;align-items:center;justify-content:center;">
            <div style="width:10px;height:10px;background:#050505;border-radius:50%;transform:rotate(45deg);"></div>
          </div>`,
          className: "custom-pin-icon",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })
      : null;

  const mapCenter: [number, number] =
    lat && lng ? [lat, lng] : cityCenter || [-1.8312, -78.1834];

  // ── SSR / pre-hydration placeholder ──────────────────────────────────────
  if (!isClient || !MapComponents) {
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

  const { MapContainer, TileLayer, Marker } = MapComponents;

  return (
    <div className="space-y-3">
      {/* Controls */}
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

      {/* Map */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-brand-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom
          className="w-full h-full"
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Click handler — must be INSIDE MapContainer */}
          <MapClickHandler onMapClick={(la, ln) => reverseGeocode(la, ln)} />

          {lat && lng && customIcon && (
            <Marker position={[lat, lng]} icon={customIcon} />
          )}
        </MapContainer>

        <div className="absolute bottom-3 left-3 z-[1000] bg-brand-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none">
          <p className="text-[8px] text-brand-gold/60 font-black uppercase tracking-widest">
            Click en el mapa = nueva posición
          </p>
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-premium border-brand-gold/5 rounded-xl px-4 py-2">
          <span className="text-[7px] text-white/20 uppercase font-black block mb-0.5">Latitud</span>
          <span className="text-xs text-brand-gold font-mono">{lat ? lat.toFixed(6) : "—"}</span>
        </div>
        <div className="glass-premium border-brand-gold/5 rounded-xl px-4 py-2">
          <span className="text-[7px] text-white/20 uppercase font-black block mb-0.5">Longitud</span>
          <span className="text-xs text-brand-gold font-mono">{lng ? lng.toFixed(6) : "—"}</span>
        </div>
      </div>

      {/* Reverse-geocoded address */}
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
