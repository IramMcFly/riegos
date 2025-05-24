"use client";

import React, { useState, useEffect } from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiNightClear,
  WiSunrise,
  WiDayCloudy,
} from "react-icons/wi";
import SensorStatus from "./SensorStatus"; // Importar el nuevo componente

const iconMap = {
  "01d": <WiDaySunny size={32} />,
  "01n": <WiNightClear size={32} />,
  "02d": <WiDayCloudy size={32} />,
  "02n": <WiCloud size={32} />,
  "03d": <WiCloud size={32} />,
  "03n": <WiCloud size={32} />,
  "09d": <WiRain size={32} />,
  "09n": <WiRain size={32} />,
  "10d": <WiRain size={32} />,
  "10n": <WiRain size={32} />,
  sunrise: <WiSunrise size={32} />,
};

const Dashboard = () => {
  const [waterLimit, setWaterLimit] = useState(10000);
  const [hourlyData, setHourlyData] = useState(null);
  const [error, setError] = useState(null);

  const usedLiters = waterLimit * 0.68;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather");
        const data = await res.json();

        if (!data.list) {
          setError("No se pudo obtener el clima.");
          console.error("❌ No se encontró 'list' en la respuesta:", data);
          return;
        }

        const hourlyFormatted = data.list.slice(0, 6).map((entry) => ({
          time: new Date(entry.dt * 1000).toLocaleTimeString([], {
            hour: "numeric",
            hour12: true,
          }),
          temp: Math.round(entry.main.temp),
          rain: entry.pop ? Math.round(entry.pop * 100) : 0,
          icon: iconMap[entry.weather[0].icon] || <WiCloud size={32} />,
        }));
        setHourlyData(hourlyFormatted);
      } catch (err) {
        console.error("🚨 Error al obtener datos del clima:", err);
        setError("Error al conectar con el clima.");
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-4 space-y-4 bg-white min-h-screen">
      {/* Sensores */}
      <SensorStatus /> {/* Reemplazar el div estático con el componente SensorStatus */}

      {/* Consumo de agua */}
      <div className="border-2 border-blue-400 p-4">
        <h3 className="text-red-600 font-semibold mb-2">Consumo de agua</h3>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-red-500 h-6 rounded-full"
            style={{ width: `${(usedLiters / waterLimit) * 100}%` }}
          />
        </div>
        <p className="text-sm mt-1">
          {usedLiters.toFixed(0)} litros usados de {waterLimit} L
        </p>
      </div>

      {/* Pronóstico por hora */}
      <div className="border-2 border-blue-300 p-4">
        <h3 className="text-red-600 font-semibold">Clima y lluvia</h3>
        <p className="text-red-600 mb-2">
          Tu hora ideal de riego es a las 2AM
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {hourlyData && (
          <div className="bg-indigo-900 text-white rounded-xl p-4 shadow-md">
            <h4 className="text-lg font-semibold mb-2">Pronóstico por hora</h4>
            <div className="flex overflow-x-auto gap-4">
              {hourlyData.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[60px] text-center"
                >
                  {item.icon}
                  <div className="text-sm">{item.temp}°</div>
                  <div className="text-xs">{item.time}</div>
                  <div className="text-xs text-blue-200">{item.rain}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alerta de humedad */}
      <div className="border-2 border-red-500 p-4">
        <h3 className="text-red-600 font-semibold">
          ! Cultivo #1 (PAPAS) bajo en humedad
        </h3>
      </div>
    </div>
  );
};

export default Dashboard;
