"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapaRiegos = () => {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const datos = localStorage.getItem("gruposSensores");
    if (datos) {
      try {
        setGrupos(JSON.parse(datos));
      } catch (e) {
        console.error("❌ Error al parsear gruposSensores:", e);
      }
    }
  }, []);

  return (
    <MapContainer
      center={[28.383, -105.483]}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles © Esri &mdash; Source: Esri, Earthstar Geographics'
      />

      {grupos.map((grupo, index) =>
        Array.isArray(grupo.polygon) && grupo.polygon.length >= 3 ? (
          <Polygon
            key={`grupo-${index}`}
            positions={grupo.polygon}
            pathOptions={{ color: "lime", weight: 2 }}
          >
            <Tooltip direction="top" sticky>
              {grupo.nombre.toUpperCase()}
            </Tooltip>
          </Polygon>
        ) : null
      )}



      {grupos.flatMap((grupo, grupoIdx) =>
        Array.isArray(grupo.sensores)
          ? grupo.sensores
            .filter((sensor) => sensor.lat !== undefined && sensor.lng !== undefined)
            .map((sensor, i) => (
              <CircleMarker
                key={`sensor-${grupoIdx}-${sensor.id}`}
                center={[sensor.lat, sensor.lng]}
                radius={5}
                pathOptions={{ color: "white", fillColor: "white", fillOpacity: 1 }}
              >
                <Tooltip direction="top" sticky>
                  Sensor {i + 1}
                </Tooltip>
              </CircleMarker>
            ))
          : []
      )}

    </MapContainer>
  );
};

export default MapaRiegos;
