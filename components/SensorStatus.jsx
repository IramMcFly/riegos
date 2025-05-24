"use client";

import React, { useEffect, useState } from "react";
import { Trash2, X, Pencil } from "lucide-react";

export default function SensorStatusPage() {
  const [grupos, setGrupos] = useState([
    {
      nombre: "Papas",
      sensores: [
        { id: 1, nombre: "Sensor 1", temperatura: 23, humedad: 60 },
        { id: 2, nombre: "Sensor 2", temperatura: 25, humedad: 55 },
        { id: 3, nombre: "Sensor 3", temperatura: 22, humedad: 70 },
        { id: 4, nombre: "Sensor 4", temperatura: 24, humedad: 65 },
      ],
    },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [cantidad, setCantidad] = useState(3);

  const crearGrupo = () => {
    if (!nuevoNombre || cantidad < 1) return;

    const nuevoGrupo = {
      nombre: nuevoNombre,
      sensores: Array.from({ length: cantidad }, (_, i) => ({
        id: Date.now() + i,
        nombre: `Sensor ${i + 1}`,
        temperatura: Math.floor(Math.random() * 10) + 20,
        humedad: Math.floor(Math.random() * 50) + 40,
      })),
    };

    setGrupos((prev) => [...prev, nuevoGrupo]);
    setNuevoNombre("");
    setCantidad(3);
    setModalAbierto(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-6 py-10 relative">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Estado de Sensores</h1>
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-[#4cd964] text-white px-4 py-2 rounded-xl shadow hover:bg-[#3cc456] transition"
        >
          Añadir grupo
        </button>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nuevo grupo</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del grupo"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="number"
                min="1"
                max="20"
                placeholder="Cantidad de sensores"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearGrupo}
                  className="px-4 py-2 bg-[#4cd964] text-white rounded-lg hover:bg-[#3cc456]"
                >
                  Crear grupo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listado de grupos */}
      {grupos.map((grupo, index) => (
        <div key={index} className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Grupo: {grupo.nombre}
          </h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {grupo.sensores.map((sensor) => (
              <div
                key={sensor.id}
                className="p-4 bg-white rounded-xl border border-gray-300 shadow space-y-2"
              >
                <h3 className="font-medium text-gray-800">{sensor.nombre}</h3>
                <p className="text-sm text-gray-600">
                  🌡️ <span className="font-medium">Temperatura:</span>{" "}
                  <span className="font-semibold">{sensor.temperatura}°C</span>
                </p>
                <p className="text-sm text-gray-600">
                  💧 <span className="font-medium">Humedad:</span>{" "}
                  <span className="font-semibold">{sensor.humedad}%</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
