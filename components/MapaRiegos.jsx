"use client";

import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapaRiegos = () => {
  const papas = [
    [28.3825, -105.4905],
    [28.3825, -105.4850],
    [28.3870, -105.4850],
    [28.3870, -105.4905],
  ];

  const tomate = [
    [28.3820, -105.4820],
    [28.3820, -105.4765],
    [28.3865, -105.4765],
    [28.3865, -105.4820],
  ];

  const aguacate = [
    [28.3780, -105.4840],
    [28.3780, -105.4780],
    [28.3820, -105.4780],
    [28.3820, -105.4840],
  ];

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

      <Polygon positions={papas} pathOptions={{ color: "lime", weight: 2 }}>
        <Tooltip direction="top" sticky>PAPAS</Tooltip>
      </Polygon>

      <Polygon positions={tomate} pathOptions={{ color: "blue", weight: 2 }}>
        <Tooltip direction="top" sticky>TOMATE</Tooltip>
      </Polygon>

      <Polygon positions={aguacate} pathOptions={{ color: "red", weight: 2 }}>
        <Tooltip direction="top" sticky>AGUACATE</Tooltip>
      </Polygon>
    </MapContainer>
  );
};

export default MapaRiegos;
