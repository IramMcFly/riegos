"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  FeatureGroup,
  Polygon,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import * as turf from "@turf/turf";

// 🧠 Distribución estratégica usando grilla hexagonal
const generarPuntosOptimosEnPoligono = (poligono, numSensores, separacion) => {
  const hexGrid = turf.hexGrid(turf.bbox(poligono), separacion * 2, { units: "meters" });

  const puntosDentro = hexGrid.features
    .map((f) => turf.centerOfMass(f))
    .filter((p) => turf.booleanPointInPolygon(p, poligono));

  const puntosMezclados = puntosDentro.sort(() => Math.random() - 0.5);
  const puntosFiltrados = [];

  for (const punto of puntosMezclados) {
    const esValido = puntosFiltrados.every((existente) => {
      const distancia = turf.distance(punto, existente, { units: "meters" });
      return distancia >= separacion;
    });

    if (esValido) puntosFiltrados.push(punto);
    if (puntosFiltrados.length === numSensores) break;
  }

  return puntosFiltrados;
};

const MapDrawControl = ({ onPoligonoConfirmado }) => {
  const map = useMap();
  const featureGroupRef = useRef(null);

  useEffect(() => {
    const drawnItems = featureGroupRef.current;
    if (!map || !drawnItems) return;

    const drawControl = new L.Control.Draw({
      draw: {
        marker: false,
        circle: false,
        rectangle: false,
        polyline: false,
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: "green",
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: true,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      const coords = layer.getLatLngs()[0].map((latlng) => [latlng.lng, latlng.lat]);
      coords.push(coords[0]);
      const turfPolygon = turf.polygon([coords]);

      const area = turf.area(turfPolygon);

      const radioCobertura = 100; // metros
      const separacionSensores = 50; // mínimo entre sensores
      const areaPorSensor = Math.PI * Math.pow(radioCobertura, 2); // ≈ 31415.9 m²

      const sensoresNecesarios = Math.max(1, Math.floor(area / areaPorSensor));
      const puntosSensores = generarPuntosOptimosEnPoligono(turfPolygon, sensoresNecesarios, separacionSensores);

      const sensorPoints = puntosSensores.map((f, i) => ({
        id: Date.now() + i,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        nombre: `Sensor ${i + 1}`,
        temperatura: Math.floor(Math.random() * 10) + 20,
        humedad: Math.floor(Math.random() * 50) + 40,
        coordenadas: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
        esMaster: false,
      }));

      // ➕ Calcular centroide del polígono como "Master"
      const centroide = turf.centerOfMass(turfPolygon).geometry.coordinates; // [lng, lat]
      const puntoMaster = turf.point(centroide);

      if (turf.booleanPointInPolygon(puntoMaster, turfPolygon)) {
        const sensorMaster = {
          id: Date.now() + 9999,
          lat: centroide[1],
          lng: centroide[0],
          nombre: "Master",
          temperatura: null,
          humedad: null,
          coordenadas: [centroide[1], centroide[0]],
          esMaster: true,
        };

        sensorPoints.push(sensorMaster);
      }

      onPoligonoConfirmado({
        polygon: layer.getLatLngs()[0],
        area,
        sensores: sensorPoints,
      });
    });

    return () => {
      map.removeControl(drawControl);
    };
  }, [map, onPoligonoConfirmado]);

  return <FeatureGroup ref={featureGroupRef} />;
};


const AgregarGrupoDesdeMapa = ({ onGrupoConfirmado, onCancel }) => {
  const [ubicacion, setUbicacion] = useState([28.634, -106.069]);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [datosGrupo, setDatosGrupo] = useState(null);
  const [gruposExistentes, setGruposExistentes] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUbicacion([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );

    const datosGuardados = localStorage.getItem("gruposSensores");
    if (datosGuardados) {
      try {
        setGruposExistentes(JSON.parse(datosGuardados));
      } catch (e) {
        console.error("Error al parsear gruposSensores existentes:", e);
        setGruposExistentes([]);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            Delimita el área del nuevo grupo de sensores
          </h2>
          <input
            type="text"
            placeholder="Nombre del grupo"
            value={nombreGrupo}
            onChange={(e) => setNombreGrupo(e.target.value)}
            className="mt-2 w-full border px-4 py-2 rounded-lg text-gray-700"
          />
        </div>

        <div className="flex-1">
          <MapContainer center={ubicacion} zoom={16} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles © Esri &mdash; Source: Esri, Earthstar Geographics'
            />
            <MapDrawControl onPoligonoConfirmado={setDatosGrupo} />

            {datosGrupo?.polygon && (
              <Polygon positions={datosGrupo.polygon} pathOptions={{ color: "green" }} />
            )}

            {gruposExistentes.map((grupo, index) =>
              Array.isArray(grupo.polygon) && grupo.polygon.length >= 3 ? (
                <Polygon
                  key={`existente-grupo-${index}`}
                  positions={grupo.polygon}
                  pathOptions={{ color: "blue", weight: 2, dashArray: "5, 5" }}
                >
                  <Tooltip direction="top" sticky>
                    {grupo.nombre.toUpperCase()} (Existente)
                  </Tooltip>
                </Polygon>
              ) : null
            )}

            {gruposExistentes.flatMap((grupo, grupoIdx) =>
              Array.isArray(grupo.sensores)
                ? grupo.sensores
                    .filter((sensor) => sensor.lat !== undefined && sensor.lng !== undefined)
                    .map((sensor, i) => (
                      <CircleMarker
                        key={`existente-sensor-${grupoIdx}-${sensor.id || i}`}
                        center={[sensor.lat, sensor.lng]}
                        radius={sensor.esMaster ? 6 : 3}
                        pathOptions={{
                          color: sensor.esMaster ? "blue" : "cyan",
                          fillColor: sensor.esMaster ? "blue" : "cyan",
                          fillOpacity: 0.9,
                        }}
                      >
                        <Tooltip direction="top" sticky>
                          {sensor.nombre} {sensor.esMaster ? "(Master)" : "(Existente)"}
                        </Tooltip>
                      </CircleMarker>
                    ))
                : []
            )}
          </MapContainer>
        </div>

        <div className="p-4 border-t flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            disabled={!nombreGrupo.trim() || !datosGrupo?.sensores?.length}
            onClick={() =>
              onGrupoConfirmado({ nombre: nombreGrupo.trim(), ...datosGrupo })
            }
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Confirmar grupo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarGrupoDesdeMapa;
