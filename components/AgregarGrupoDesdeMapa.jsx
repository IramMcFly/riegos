import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, FeatureGroup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import * as turf from "@turf/turf";

// Función para generar puntos aleatorios dentro de un polígono
const generarPuntosAleatoriosDentroDelPoligono = (poligono, numSensores, radio) => {
  let puntosGenerados = [];
  let intentos = 0;
  const maxIntentos = numSensores * 10; // Limitar los intentos para evitar bucles infinitos

  // Generar hasta numSensores puntos
  while (puntosGenerados.length < numSensores && intentos < maxIntentos) {
    // Generar un punto aleatorio dentro del polígono
    const puntoAleatorio = turf.randomPoint(1, { bbox: turf.bbox(poligono) }).features[0];

    // Comprobar si el punto está dentro del polígono
    if (turf.booleanPointInPolygon(puntoAleatorio, poligono)) {
      let puntoValido = true;

      // Comprobar si el nuevo punto está lo suficientemente alejado de los puntos existentes
      for (let i = 0; i < puntosGenerados.length; i++) {
        const distancia = turf.distance(puntoAleatorio, puntosGenerados[i], { units: 'meters' });
        if (distancia < radio) {
          puntoValido = false;
          break;
        }
      }

      // Si el punto es válido, añadirlo a la lista
      if (puntoValido) {
        puntosGenerados.push(puntoAleatorio);
      }
    }

    intentos++;
  }

  return puntosGenerados;
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
      coords.push(coords[0]); // cerrar el polígono
      const turfPolygon = turf.polygon([coords]);

      const area = turf.area(turfPolygon); // m²
      const sensoresNecesarios = Math.ceil(area / 31416); // sensor cubre círculo de r = 100m

      // Generación de puntos distribuidos de manera estratégica
      const puntosSensores = generarPuntosAleatoriosDentroDelPoligono(
        turfPolygon, 
        sensoresNecesarios, 
        100 // radio de 100 metros para evitar solapamientos
      );

      const sensorPoints = puntosSensores.map((f, i) => ({
        id: Date.now() + i,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        temperatura: Math.floor(Math.random() * 10) + 20,
        humedad: Math.floor(Math.random() * 50) + 40,
        coordenadas: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
      }));

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUbicacion([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Delimita el área del nuevo grupo de sensores</h2>
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
