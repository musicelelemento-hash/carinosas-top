"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

interface LiveMapAnimatorProps {
  target: { center: [number, number]; zoom: number };
}

/**
 * This component must be rendered INSIDE a MapContainer.
 * It uses the useMap hook to animate the map to the target position with flyTo.
 */
export default function LiveMapAnimator({ target }: LiveMapAnimatorProps) {
  const map = useMap();
  const lastTarget = useRef<string>("");

  useEffect(() => {
    if (!map || !target) return;
    
    const key = `${target.center[0].toFixed(4)},${target.center[1].toFixed(4)},${target.zoom}`;
    if (key === lastTarget.current) return;
    lastTarget.current = key;

    // Smooth animated fly-to effect — like Uber/maps navigation
    map.flyTo(target.center, target.zoom, {
      animate: true,
      duration: 1.6, // seconds
      easeLinearity: 0.25,
    });
  }, [map, target]);

  return null;
}
