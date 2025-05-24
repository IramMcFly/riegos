"use client";

import React, { useState, useEffect } from "react";
import { FaSignal, FaExclamationTriangle, FaBatteryThreeQuarters, FaBatteryEmpty, FaCheckCircle } from "react-icons/fa";

// Datos de ejemplo para los sensores
const initialSensors = [
    { id: 1, name: "Sensor de Humedad - Cultivo #1 (Papas)", status: "online", battery: 80, lastReading: "Hace 2 minutos" },
    { id: 2, name: "Sensor de Temperatura - Ambiente", status: "online", battery: 95, lastReading: "Hace 1 minuto" },
    { id: 3, name: "Sensor de Nivel de Agua - Tanque Principal", status: "warning", battery: 30, lastReading: "Hace 5 minutos", message: "Batería baja" },
    { id: 4, name: "Sensor de Flujo - Riego Sector A", status: "offline", battery: 0, lastReading: "Hace 1 hora", message: "Desconectado" },
    { id: 5, name: "Sensor de Humedad - Cultivo #2 (Tomates)", status: "online", battery: 70, lastReading: "Hace 3 minutos" },
];

const SensorStatusIcon = ({ status, battery }) => {
    if (status === "offline") {
        return <FaSignal size={20} className="text-gray-400" title="Desconectado" />;
    }
    if (status === "warning" || battery < 20) {
        return <FaExclamationTriangle size={20} className="text-yellow-500" title="Advertencia" />;
    }
    return <FaCheckCircle size={20} className="text-green-500" title="Online" />;
};

const BatteryIcon = ({ level }) => {
    if (level < 20) return <FaBatteryEmpty size={20} className="text-red-500" title={`Batería: ${level}%`} />;
    if (level < 50) return <FaBatteryThreeQuarters size={20} className="text-yellow-500" transform="rotate(-90)" title={`Batería: ${level}%`} />; // Simple representation
    return <FaBatteryThreeQuarters size={20} className="text-green-500" title={`Batería: ${level}%`} />;
};

const SensorStatus = () => {
    const [sensors, setSensors] = useState(initialSensors);

    // Aquí podrías añadir un useEffect para obtener los datos de los sensores de una API
    // useEffect(() => {
    //   fetch('/api/sensors')
    //     .then(res => res.json())
    //     .then(data => setSensors(data));
    // }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md border-2 border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Estado de Sensores Conectados</h2>
            <div className="space-y-3">
                {sensors.map((sensor) => (
                    <div key={sensor.id} className="p-3 bg-gray-50 rounded-md border border-gray-300 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <SensorStatusIcon status={sensor.status} battery={sensor.battery} />
                            <div>
                                <p className="font-medium text-gray-800">{sensor.name}</p>
                                <p className="text-xs text-gray-500">Última lectura: {sensor.lastReading} {sensor.message && <span className="text-yellow-600">- {sensor.message}</span>}</p>
                            </div>
                        </div>
                        <BatteryIcon level={sensor.battery} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SensorStatus;