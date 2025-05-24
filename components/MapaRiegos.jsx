"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Tooltip,
  Circle,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";

const MapaRiegos = () => {
  const [grupos, setGrupos] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [pulsos, setPulsos] = useState([]);
  const defaultCenter = [28.383, -105.483];

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
          setMapCenter(defaultCenter);
        }
      );
    } else {
      setMapCenter(defaultCenter);
    }
  }, []);

  // Animación del radar
  useEffect(() => {
    let interval;
    if (showTelemetry) {
      interval = setInterval(() => {
        const timestamp = Date.now();
        setPulsos((prev) => [...prev, { timestamp }]);
        setTimeout(() => {
          setPulsos((prev) => prev.filter((p) => p.timestamp !== timestamp));
        }, 1500); // duración del pulso
      }, 1000); // intervalo entre pulsos
    } else {
      setPulsos([]); // limpiar pulsos si se apaga
    }
    return () => clearInterval(interval);
  }, [showTelemetry]);

  // Cálculo conexiones tipo malla
  const getNearestPairs = (sensores, maxConnections = 2) => {
    const conexiones = [];

    sensores.forEach((sensorA, idxA) => {
      const distancias = sensores
        .map((sensorB, idxB) => {
          if (idxA === idxB) return null;
          const distancia = turf.distance(
            turf.point([sensorA.lng, sensorA.lat]),
            turf.point([sensorB.lng, sensorB.lat]),
            { units: "meters" }
          );
          return { sensorB, distancia };
        })
        .filter(Boolean)
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, maxConnections);

      distancias.forEach(({ sensorB }) => {
        const yaExiste = conexiones.some(
          (c) =>
            (c[0].id === sensorA.id && c[1].id === sensorB.id) ||
            (c[1].id === sensorA.id && c[0].id === sensorB.id)
        );
        if (!yaExiste) conexiones.push([sensorA, sensorB]);
      });
    });

    return conexiones;
  };

  if (!mapCenter) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando mapa y obteniendo ubicación...
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowTelemetry((prev) => !prev)}
        className="absolute bottom-[80px] left-4 z-[1000] bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 transition"
      >
        {showTelemetry ? "Ocultar Telemetría" : "Mostrar Telemetría"}
      </button>


      <MapContainer
        center={mapCenter}
        zoom={16}
        style={{
          position: "absolute",
          top: "64px",        // espacio para el header
          bottom: "64px",     // espacio para nav móvil
          left: 0,
          right: 0,
          width: "100%",
          height: "calc(100vh - 128px)", // ajusta altura total
          zIndex: 0,
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

        {grupos.flatMap((grupo, grupoIdx) => {
          if (!Array.isArray(grupo.sensores)) return [];

          const elementos = [];
          const conexiones = showTelemetry
            ? getNearestPairs(grupo.sensores)
            : [];

          conexiones.forEach(([s1, s2], idx) => {
            elementos.push(
              <Polyline
                key={`conn-${grupoIdx}-${idx}`}
                positions={[
                  [s1.lat, s1.lng],
                  [s2.lat, s2.lng],
                ]}
                pathOptions={{
                  color: "yellow",
                  weight: 1.5,
                  dashArray: "5, 5",
                  opacity: 0.7,
                }}
              />
            );
          });

          grupo.sensores.forEach((sensor, i) => {
            const latlng = [sensor.lat, sensor.lng];
            const esMaster = sensor.esMaster;

            // Pulsos animados
            // Pulsos animados fluidos (hasta 150 m)
            if (showTelemetry) {
              pulsos.forEach((pulso, pIdx) => {
                const tiempoTotal = 2000; // ms duración del pulso
                const ahora = Date.now();
                const elapsed = (ahora - pulso.timestamp) / tiempoTotal; // 0 a 1
                if (elapsed > 1) return;

                const radius = 30 + elapsed * 120; // de 30m hasta 150m
                const opacity = 0.4 * (1 - elapsed); // suave desvanecimiento

                elementos.push(
                  <Circle
                    key={`radar-${grupoIdx}-${sensor.id}-p${pulso.timestamp}-${pIdx}`}
                    center={latlng}
                    radius={radius}
                    pathOptions={{
                      color: esMaster ? "blue" : "white",
                      fillColor: esMaster ? "blue" : "white",
                      fillOpacity: opacity,
                      weight: 1,
                    }}
                  />
                );
              });
            }


            // Círculo marcador
            elementos.push(
              <CircleMarker
                key={`sensor-${grupoIdx}-${sensor.id}`}
                center={latlng}
                radius={esMaster ? 8 : 5}
                pathOptions={{
                  color: esMaster ? "blue" : "white",
                  fillColor: esMaster ? "blue" : "white",
                  fillOpacity: 1,
                }}
              >
                <Tooltip direction="top" sticky>
                  {esMaster ? "Master" : `Sensor ${i + 1}`}
                </Tooltip>
              </CircleMarker>
            );
          });

          return elementos;
        })}
      </MapContainer>
    </>
  );
};

export default MapaRiegos;
