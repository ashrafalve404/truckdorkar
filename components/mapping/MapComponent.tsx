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

interface MapComponentProps {
    pickup?: [number, number];
    drop?: [number, number];
}

function ChangeView({ pickup, drop }: { pickup?: [number, number]; drop?: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (pickup && drop) {
            const bounds = L.latLngBounds([pickup, drop]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (pickup) {
            map.setView(pickup, 14);
        }
    }, [pickup, drop, map]);
    return null;
}

export default function MapComponent({ pickup, drop }: MapComponentProps) {
    const defaultCenter: [number, number] = [23.8103, 90.4125]; // Default to Dhaka
    const [route, setRoute] = useState<[number, number][]>([]);

    useEffect(() => {
        const fetchRoute = async () => {
            if (!pickup || !drop) {
                setRoute([]);
                return;
            }

            try {
                // OSRM coordinates are long,lat
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${drop[1]},${drop[0]}?overview=full&geometries=geojson`
                );
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    // GeoJSON coords are [long, lat], Leaflet needs [lat, long]
                    const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [
                        coord[1],
                        coord[0],
                    ]) as [number, number][];
                    setRoute(coordinates);
                } else {
                    // Fallback to straight line if API fails
                    setRoute([pickup, drop]);
                }
            } catch (error) {
                console.error("Scale routing error:", error);
                setRoute([pickup, drop]);
            }
        };

        fetchRoute();
    }, [pickup, drop]);

    return (
        <MapContainer
            center={pickup || defaultCenter}
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

            <ChangeView pickup={pickup} drop={drop} />

            {route.length > 0 && (
                <Polyline
                    positions={route}
                    color="#f59e0b"
                    weight={5}
                    opacity={0.8}
                    lineCap="round"
                    lineJoin="round"
                />
            )}
        </MapContainer>
    );
}
