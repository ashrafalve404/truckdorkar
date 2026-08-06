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

// Custom Green Standalone SVG Truck Icon (Driver Online / Active)
const createGreenTruckIcon = () => {
    if (typeof window === "undefined") return DefaultIcon;
    return L.divIcon({
        className: "custom-green-truck-icon",
        html: `
            <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(34, 197, 94, 0.45); animation: truck-pulse 1.5s ease-in-out infinite alternate;"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#16a34a" stroke="#ffffff" stroke-width="1" style="position: relative; z-index: 2; filter: drop-shadow(0 4px 10px rgba(22, 163, 74, 0.6));">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
            </div>
            <style>
                @keyframes truck-pulse {
                    0% { transform: scale(0.8); opacity: 0.4; }
                    100% { transform: scale(1.5); opacity: 0.9; }
                }
            </style>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
    });
};

// Custom Grey Standalone SVG Truck Icon (Driver Offline / Last Location)
const createGreyTruckIcon = () => {
    if (typeof window === "undefined") return DefaultIcon;
    return L.divIcon({
        className: "custom-grey-truck-icon",
        html: `
            <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#64748b" stroke="#ffffff" stroke-width="1" style="position: relative; z-index: 2; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
            </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
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
