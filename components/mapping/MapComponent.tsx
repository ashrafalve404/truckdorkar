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

// Custom Green SVG Top-View Truck Icon (Driver Online / Active)
const createGreenTruckIcon = () => {
    if (typeof window === "undefined") return DefaultIcon;
    return L.divIcon({
        className: "custom-green-truck-icon",
        html: `
            <div style="position: relative; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 52px; height: 52px; border-radius: 50%; background: rgba(34, 197, 94, 0.35); animation: sonar-pulse 1.8s cubic-bezier(0, 0.2, 0.8, 1) infinite;"></div>
                <div style="position: relative; z-index: 2; width: 44px; height: 44px; background: linear-gradient(135deg, #22c55e, #15803d); border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 8px 22px rgba(34, 197, 94, 0.6); display: flex; align-items: center; justify-content: center;">
                    <!-- Top-View Truck Vector -->
                    <svg width="26" height="26" viewBox="0 0 36 36" fill="#ffffff" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));">
                        <path d="M12 2C10.34 2 9 3.34 9 5V8H7C6.45 8 6 8.45 6 9V12C6 12.55 6.45 13 7 13H9V31C9 32.1 9.9 33 11 33H25C26.1 33 27 32.1 27 31V13H29C29.55 13 30 12.55 30 12V9C30 8.45 29.55 8 29 8H27V5C27 3.34 25.66 2 24 2H12ZM11 5C11 4.45 11.45 4 12 4H24C24.55 4 25 4.45 25 5V8H11V5ZM12 9.5H24V11.5H12V9.5Z"/>
                    </svg>
                </div>
            </div>
            <style>
                @keyframes sonar-pulse {
                    0% { transform: scale(0.7); opacity: 0.9; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
            </style>
        `,
        iconSize: [56, 56],
        iconAnchor: [28, 28],
    });
};

// Custom Grey SVG Top-View Truck Icon (Driver Offline / Last Location)
const createGreyTruckIcon = () => {
    if (typeof window === "undefined") return DefaultIcon;
    return L.divIcon({
        className: "custom-grey-truck-icon",
        html: `
            <div style="position: relative; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;">
                <div style="position: relative; z-index: 2; width: 44px; height: 44px; background: linear-gradient(135deg, #64748b, #334155); border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35); display: flex; align-items: center; justify-content: center;">
                    <!-- Top-View Truck Vector -->
                    <svg width="26" height="26" viewBox="0 0 36 36" fill="#ffffff" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">
                        <path d="M12 2C10.34 2 9 3.34 9 5V8H7C6.45 8 6 8.45 6 9V12C6 12.55 6.45 13 7 13H9V31C9 32.1 9.9 33 11 33H25C26.1 33 27 32.1 27 31V13H29C29.55 13 30 12.55 30 12V9C30 8.45 29.55 8 29 8H27V5C27 3.34 25.66 2 24 2H12ZM11 5C11 4.45 11.45 4 12 4H24C24.55 4 25 4.45 25 5V8H11V5ZM12 9.5H24V11.5H12V9.5Z"/>
                    </svg>
                </div>
            </div>
        `,
        iconSize: [56, 56],
        iconAnchor: [28, 28],
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
