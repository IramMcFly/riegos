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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Sensores */}
      <div className="border-2 border-[#4cd964] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-[#5ac8fa] font-semibold text-lg sm:text-xl">4 Sensores Conectados</h2>
      </div>

      {/* Consumo de agua */}
      <div className="border-2 border-[#5ac8fa] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-[#4cd964] font-semibold text-lg sm:text-xl mb-3">Consumo de agua</h3>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div
            className="bg-[#4cd964] h-8 rounded-full"
            style={{ width: `${(usedLiters / waterLimit) * 100}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-gray-700 sm:text-base">
          {usedLiters.toFixed(0)} litros usados de {waterLimit} L
        </p>
      </div>

      {/* Pronóstico por hora */}
      <div className="border-2 border-[#5ac8fa] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-[#4cd964] font-semibold text-lg sm:text-xl">Clima y lluvia</h3>
        <p className="text-[#4cd964] mb-3 text-sm sm:text-base">
          Tu hora ideal de riego es a las 2AM
        </p>
        {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}

        {hourlyData && (
          <div className="bg-gradient-to-r from-[#4cd964] to-[#5ac8fa] text-white rounded-xl p-6 shadow-lg">
            <h4 className="text-lg sm:text-xl font-semibold mb-3">Pronóstico por hora</h4>
            <div className="flex overflow-x-auto gap-6">
              {hourlyData.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[80px] sm:min-w-[100px] text-center"
                >
                  {item.icon}
                  <div className="text-sm sm:text-base">{item.temp}°</div>
                  <div className="text-xs sm:text-sm">{item.time}</div>
                  <div className="text-lg sm:text-xl font-semibold text-yellow-300">
                    {item.rain}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alerta de humedad */}
      <div className="p-6 bg-gradient-to-r from-[#4cd964] to-[#5ac8fa] text-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="font-semibold text-lg sm:text-xl">
          ¡Cultivo #1 (PAPAS) bajo en humedad!
        </h3>
      </div>
    </div>
  );
};

export default Dashboard;
