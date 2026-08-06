"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Green Top-View Container Truck Icon (Driver Online / Active)
const createGreenTruckIcon = () => {
    if (typeof window === "undefined") return DefaultIcon;
    return L.divIcon({
        className: "custom-green-truck-icon",
        html: `
            <div style="position: relative; width: 28px; height: 56px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 36px; height: 36px; top: 10px; border-radius: 50%; background: rgba(34, 197, 94, 0.45); animation: truck-sonar 1.6s ease-out infinite;"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="28" height="56" style="position: relative; z-index: 2; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));">
                  <rect x="25" y="10" width="50" height="12" rx="4" fill="#14532d" />
                  <rect x="14" y="22" width="7" height="18" rx="2" fill="#111111" />
                  <rect x="79" y="22" width="7" height="18" rx="2" fill="#111111" />
                  <rect x="14" y="80" width="7" height="22" rx="2" fill="#111111" />
                  <rect x="79" y="80" width="7" height="22" rx="2" fill="#111111" />
                  <rect x="14" y="160" width="7" height="22" rx="2" fill="#111111" />
                  <rect x="79" y="160" width="7" height="22" rx="2" fill="#111111" />
                  <rect x="13" y="32" width="10" height="5" rx="2" fill="#166534" />
                  <rect x="77" y="32" width="10" height="5" rx="2" fill="#166534" />
                  <rect x="23" y="18" width="54" height="40" rx="8" fill="#166534" />
                  <path d="M 29 32 Q 50 26 71 32 L 68 42 Q 50 38 32 42 Z" fill="#b7e4c7" opacity="0.95" />
                  <rect x="19" y="58" width="62" height="130" rx="6" fill="#16a34a" stroke="#14532d" stroke-width="3" />
                  <line x1="25" y1="80" x2="75" y2="80" stroke="#4ade80" stroke-width="3" />
                  <line x1="25" y1="110" x2="75" y2="110" stroke="#4ade80" stroke-width="3" />
                  <line x1="25" y1="140" x2="75" y2="140" stroke="#4ade80" stroke-width="3" />
                  <line x1="25" y1="170" x2="75" y2="170" stroke="#4ade80" stroke-width="3" />
                </svg>
            </div>
            <style>
                @keyframes truck-sonar {
                    0% { transform: scale(0.6); opacity: 0.9; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
            </style>
        `,
        iconSize: [28, 56],
        iconAnchor: [14, 28],
    });
};

// Custom Grey Top-View Container Truck Icon (Driver Offline / Last Location)
const createGreyTruckIcon = () => {
    if (typeof window === "undefined") return DefaultIcon;
    return L.divIcon({
        className: "custom-grey-truck-icon",
        html: `
            <div style="position: relative; width: 28px; height: 56px; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="28" height="56" style="position: relative; z-index: 2; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
                  <rect x="25" y="10" width="50" height="12" rx="4" fill="#1e293b" />
                  <rect x="14" y="22" width="7" height="18" rx="2" fill="#0f172a" />
                  <rect x="79" y="22" width="7" height="18" rx="2" fill="#0f172a" />
                  <rect x="14" y="80" width="7" height="22" rx="2" fill="#0f172a" />
                  <rect x="79" y="80" width="7" height="22" rx="2" fill="#0f172a" />
                  <rect x="14" y="160" width="7" height="22" rx="2" fill="#0f172a" />
                  <rect x="79" y="160" width="7" height="22" rx="2" fill="#0f172a" />
                  <rect x="13" y="32" width="10" height="5" rx="2" fill="#334155" />
                  <rect x="77" y="32" width="10" height="5" rx="2" fill="#334155" />
                  <rect x="23" y="18" width="54" height="40" rx="8" fill="#334155" />
                  <path d="M 29 32 Q 50 26 71 32 L 68 42 Q 50 38 32 42 Z" fill="#cbd5e1" opacity="0.95" />
                  <rect x="19" y="58" width="62" height="130" rx="6" fill="#64748b" stroke="#1e293b" stroke-width="3" />
                  <line x1="25" y1="80" x2="75" y2="80" stroke="#94a3b8" stroke-width="3" />
                  <line x1="25" y1="110" x2="75" y2="110" stroke="#94a3b8" stroke-width="3" />
                  <line x1="25" y1="140" x2="75" y2="140" stroke="#94a3b8" stroke-width="3" />
                  <line x1="25" y1="170" x2="75" y2="170" stroke="#94a3b8" stroke-width="3" />
                </svg>
            </div>
        `,
        iconSize: [28, 56],
        iconAnchor: [14, 28],
    });
};

interface MapComponentProps {
    pickup?: [number, number];
    drop?: [number, number];
    driverLocation?: [number, number];
    isDriverOnline?: boolean;
    driverName?: string;
    lastActiveText?: string;
}

function ChangeView({
    pickup,
    drop,
    driverLocation,
}: {
    pickup?: [number, number];
    drop?: [number, number];
    driverLocation?: [number, number];
}) {
    const map = useMap();
    useEffect(() => {
        const points = [pickup, drop, driverLocation].filter(Boolean) as [number, number][];
        if (points.length > 1) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (points.length === 1) {
            map.setView(points[0], 14);
        }
    }, [pickup, drop, driverLocation, map]);
    return null;
}

export default function MapComponent({
    pickup,
    drop,
    driverLocation,
    isDriverOnline = false,
    driverName = "Driver Truck",
    lastActiveText,
}: MapComponentProps) {
    const defaultCenter: [number, number] = [23.8103, 90.4125]; // Default to Dhaka
    const [route, setRoute] = useState<[number, number][]>([]);

    useEffect(() => {
        const fetchRoute = async () => {
            const start = driverLocation || pickup;
            const end = drop || pickup;

            if (!start || !end) {
                setRoute([]);
                return;
            }

            try {
                // OSRM coordinates are long,lat
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
                );
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [
                        coord[1],
                        coord[0],
                    ]) as [number, number][];
                    setRoute(coordinates);
                } else {
                    setRoute([start, end]);
                }
            } catch (error) {
                console.error("Scale routing error:", error);
                setRoute([start, end]);
            }
        };

        fetchRoute();
    }, [pickup, drop, driverLocation]);

    return (
        <MapContainer
            center={driverLocation || pickup || defaultCenter}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pickup && (
                <Marker position={pickup}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}
            {drop && (
                <Marker position={drop}>
                    <Popup>Drop-off Location</Popup>
                </Marker>
            )}
            {driverLocation && (
                <Marker
                    position={driverLocation}
                    icon={isDriverOnline ? createGreenTruckIcon() : createGreyTruckIcon()}
                >
                    <Popup>
                        <div className="p-1 font-sans">
                            <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 mb-1">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${
                                        isDriverOnline ? "bg-green-500 animate-pulse" : "bg-slate-400"
                                    }`}
                                />
                                {driverName} ({isDriverOnline ? "Active / Live" : "Offline"})
                            </div>
                            {lastActiveText && (
                                <p className="text-[10px] text-slate-500 font-bold m-0">{lastActiveText}</p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            )}

            <ChangeView pickup={pickup} drop={drop} driverLocation={driverLocation} />

            {route.length > 0 && (
                <Polyline
                    positions={route}
                    color={isDriverOnline ? "#16a34a" : "#f59e0b"}
                    weight={5}
                    opacity={0.8}
                    lineCap="round"
                    lineJoin="round"
                />
            )}
        </MapContainer>
    );
}
