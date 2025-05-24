"use client";

import React, { useState, useEffect } from "react";
import {
  WiDaySunny, WiCloud, WiRain, WiNightClear,
  WiSunrise, WiDayCloudy,
} from "react-icons/wi";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

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
  const [aguaUsada, setAguaUsada] = useState(6800);
  const [inputAgua, setInputAgua] = useState("");
  const [editandoLimite, setEditandoLimite] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [viewMode, setViewMode] = useState("hourly"); // 'hourly' or 'daily'
  const [idealTime, setIdealTime] = useState(null);
  const [humedadActual, setHumedadActual] = useState(null);
  const [error, setError] = useState(null);
  const [humedadBaja, setHumedadBaja] = useState(false);
  const router = useRouter();

  const porcentajeUso = (aguaUsada / waterLimit) * 100;
  let barraColor = "#4cd964";
  if (porcentajeUso >= 100) barraColor = "#ff3b30";
  else if (porcentajeUso >= 80) barraColor = "#ffcc00";

  useEffect(() => {
    const aguaGuardada = localStorage.getItem("aguaDisponible");
    const usoGuardado = localStorage.getItem("aguaUsada");

    if (aguaGuardada) {
      const val = parseInt(aguaGuardada);
      if (!isNaN(val)) setWaterLimit(val);
    }

    if (usoGuardado) {
      const val = parseInt(usoGuardado);
      if (!isNaN(val)) setAguaUsada(val);
    }

    const datosSensores = localStorage.getItem("gruposSensores");
    if (datosSensores) {
      try {
        const grupos = JSON.parse(datosSensores);
        const hayHumedadBaja = grupos.some((grupo) =>
          grupo.sensores?.some((s) => s.humedad < 50)
        );
        setHumedadBaja(hayHumedadBaja);
      } catch (e) {
        console.error("❌ Error al leer sensores:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather", { method: "GET" });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        if (!data.list) throw new Error("Falta propiedad 'list' en la respuesta");

        // Humedad actual del primer elemento
        const humedad = data.list[0]?.main?.humidity || null;
        setHumedadActual(humedad);

        // Vista por hora
        const hourly = data.list.slice(0, 6).map((entry) => {
          const time = new Date(entry.dt * 1000);
          return {
            type: "hourly",
            time: time.toLocaleTimeString([], { hour: "numeric", hour12: true }),
            hour: time.getHours(),
            temp: Math.round(entry.main.temp),
            rain: Math.round((entry.pop || 0) * 100),
            icon: iconMap[entry.weather[0].icon] || <WiCloud size={32} />,
          };
        });

        // Vista por día
        const dailyMap = new Map();

        data.list.forEach((entry) => {
          const day = new Date(entry.dt * 1000).toLocaleDateString("es-MX", {
            weekday: "short",
          });

          if (!dailyMap.has(day)) {
            dailyMap.set(day, []);
          }
          dailyMap.get(day).push(entry);
        });

        const daily = Array.from(dailyMap.entries()).slice(0, 4).map(([day, entries]) => {
          const temps = entries.map((e) => e.main.temp);
          const rains = entries.map((e) => e.pop || 0);

          return {
            type: "daily",
            day,
            tempMin: Math.round(Math.min(...temps)),
            tempMax: Math.round(Math.max(...temps)),
            rain: Math.round((rains.reduce((a, b) => a + b, 0) / rains.length) * 100),
            icon: iconMap[entries[0].weather[0].icon] || <WiCloud size={32} />,
          };
        });

        setWeatherData({ hourly, daily });

        // Ideal time solo aplica en modo por hora
        const ideal = data.list
          .slice(0, 12)
          .map((entry) => {
            const hour = new Date(entry.dt * 1000);
            return {
              hourNum: hour.getHours(),
              label: hour.toLocaleTimeString([], { hour: "numeric", hour12: true }),
              pop: entry.pop,
              temp: entry.main.temp,
            };
          })
          .filter((e) => e.temp >= 15 && e.temp <= 28)
          .sort((a, b) => a.pop - b.pop)[0];

        setIdealTime(ideal?.label || null);
      } catch (err) {
        console.error("🚨 Error al obtener datos del clima:", err);
        setError("Error al conectar con el clima.");
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen pb-24">
      {/* Consumo de agua */}
      <div className="border-2 border-[#5ac8fa] p-6 rounded-3xl shadow-lg">
        <h3 className="text-[#4cd964] font-semibold text-lg sm:text-xl mb-3">
          Consumo de agua
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div
            className="h-8 rounded-full"
            style={{
              width: `${porcentajeUso > 100 ? 100 : porcentajeUso}%`,
              backgroundColor: barraColor,
            }}
          />
        </div>
        <p className="text-sm mt-2 text-gray-700 sm:text-base">
          {aguaUsada.toFixed(0)} litros usados de {waterLimit} L
        </p>

        {editandoLimite ? (
          <div className="mt-4 flex gap-2 items-center">
            <input
              type="number"
              value={inputAgua}
              onChange={(e) => setInputAgua(e.target.value)}
              placeholder="Nuevo límite (L)"
              className="border rounded-lg px-2 py-1 w-32 text-sm text-gray-700"
            />
            <button
              onClick={() => {
                const nuevo = parseInt(inputAgua);
                if (!isNaN(nuevo) && nuevo > 0) {
                  setWaterLimit(nuevo);
                  localStorage.setItem("aguaDisponible", nuevo);
                  setInputAgua("");
                  setEditandoLimite(false);
                }
              }}
              className="px-3 py-1 text-sm bg-[#4cd964] text-white rounded hover:bg-[#3cc456]"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditandoLimite(false)}
              className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditandoLimite(true)}
            className="mt-4 px-4 py-2 text-sm font-semibold bg-white text-[#4cd964] rounded-full shadow hover:bg-gray-100 transition"
          >
            Editar límite
          </button>
        )}
      </div>

      {/* Clima */}
      <div className="border-2 border-[#5ac8fa] p-6 rounded-3xl shadow-lg">
        <h3 className="text-[#4cd964] font-semibold text-lg sm:text-xl">
          Clima y lluvia
        </h3>

        {humedadActual !== null && (
          <p className="text-sm text-gray-700 mt-1 mb-1">
            Humedad actual: <span className="font-semibold">{humedadActual}%</span>
          </p>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setViewMode("hourly")}
            className={`px-3 py-1 text-sm rounded-full ${viewMode === "hourly" ? "bg-[#4cd964] text-white" : "bg-gray-200 text-gray-800"
              }`}
          >
            Ver por hora
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1 text-sm rounded-full ${viewMode === "daily" ? "bg-[#4cd964] text-white" : "bg-gray-200 text-gray-800"
              }`}
          >
            Ver por días
          </button>
        </div>

        <p className="text-[#4cd964] mb-3 text-sm sm:text-base mt-2">
          {viewMode === "hourly" && idealTime
            ? `Tu hora ideal de riego es a las ${idealTime}`
            : viewMode === "hourly"
              ? "No se encontró una hora ideal de riego"
              : ""}
        </p>

        {error && (
          <p className="text-red-500 text-sm sm:text-base">{error}</p>
        )}

        {weatherData[viewMode] && (
          <div className="bg-gradient-to-r from-[#4cd964] to-[#5ac8fa] text-white rounded-xl p-6 shadow-lg mt-4">
            <h4 className="text-lg sm:text-xl font-semibold mb-3">
              {viewMode === "hourly" ? "Pronóstico por hora" : "Pronóstico por día"}
            </h4>
            <div className="flex overflow-x-auto gap-6">
              {weatherData[viewMode].map((item, i) => {
                const esIdeal = item.time === idealTime;
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center min-w-[120px] px-3 py-2 rounded-xl ${esIdeal ? "bg-white/20 shadow-inner" : ""
                      }`}
                  >
                    {item.icon}
                    <div className="text-base sm:text-lg md:text-xl">
                      {viewMode === "hourly"
                        ? `${item.temp}°`
                        : `${item.tempMin}° - ${item.tempMax}°`}
                    </div>
                    <div className="text-sm sm:text-base">
                      {item.time || item.day}
                    </div>
                    <div
                      className={`text-sm font-semibold text-center ${esIdeal ? "text-white" : "text-yellow-300"
                        }`}
                    >
                      Lluvia: {item.rain}%
                      {esIdeal && (
                        <div className="text-xs font-normal text-white mt-1">
                          <FaStar className="inline text-yellow-300 mr-1" /> Hora ideal
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Alerta de humedad */}
      {humedadBaja && (
        <div className="p-6 bg-gradient-to-r from-[#4cd964] to-[#5ac8fa] text-white rounded-3xl shadow-lg">
          <h3 className="font-semibold text-lg sm:text-xl mb-2">
            ¡Alerta! Un cultivo tiene humedad menor al 50%
          </h3>
          <button
            onClick={() => router.push("/sensores")}
            className="mt-2 px-4 py-2 bg-white text-[#4cd964] font-semibold rounded-full shadow hover:bg-gray-100"
          >
            Ver sensores
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
