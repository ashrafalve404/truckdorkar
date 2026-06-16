"use client";

import { useEffect } from "react";
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

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapComponent({ pickup, drop }: MapComponentProps) {
    const center: [number, number] = pickup || [23.8103, 90.4125]; // Default to Dhaka
    const zoom = pickup && drop ? 12 : 13;

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pickup && (
                <Marker position={pickup}>
                    <Popup>Pickup</Popup>
                </Marker>
            )}
            {drop && (
                <Marker position={drop}>
                    <Popup>Drop-off</Popup>
                </Marker>
            )}
            {pickup && drop && <ChangeView center={pickup} zoom={zoom} />}
            {pickup && drop && <Polyline positions={[pickup, drop]} color="blue" />}
        </MapContainer>
    );
}
