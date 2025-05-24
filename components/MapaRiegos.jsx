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
  const [mapCenter, setMapCenter] = useState(null); // Estado para el centro del mapa
  const defaultCenter = [28.383, -105.483]; // Ubicación por defecto

  useEffect(() => {
    const datos = localStorage.getItem("gruposSensores");
    if (datos) {
      try {
        setGrupos(JSON.parse(datos));
      } catch (e) {
        console.error("❌ Error al parsear gruposSensores:", e);
        setGrupos([]);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error obteniendo la ubicación del usuario:", error);
          setMapCenter(defaultCenter); // Usar default en caso de error
        }
      );
    } else {
      console.log("La geolocalización no es soportada por este navegador.");
      setMapCenter(defaultCenter); // Usar default si no hay soporte
    }
  }, []);

  if (!mapCenter) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Cargando mapa y obteniendo ubicación...
      </div>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={16}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%',
        zIndex: 0 // Asegura que el mapa esté detrás del header (z-40) y nav móvil (z-50)
      }}
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
