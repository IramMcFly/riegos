"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Trash2, X, Pencil, AlertTriangle, Info } from "lucide-react";
import dynamic from "next/dynamic";

const AgregarGrupoDesdeMapa = dynamic(() => import("@/components/AgregarGrupoDesdeMapa"), {
    ssr: false,
});

function GrupoCard({ grupo, grupoIndex, abrirEdicion, eliminarGrupo, eliminarSensor }) {
    const { promedioHumedad, alertaHumedad } = useMemo(() => {
        if (!grupo.sensores || grupo.sensores.length === 0) {
            return { promedioHumedad: 0, alertaHumedad: false };
        }
        const totalHumedad = grupo.sensores.reduce((sum, sensor) => sum + sensor.humedad, 0);
        const promedio = totalHumedad / grupo.sensores.length;
        return {
            promedioHumedad: promedio,
            alertaHumedad: promedio < 50,
        };
    }, [grupo.sensores]);

    const [tooltip, setTooltip] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cacheKey = `info-cultivo-${grupo.nombre.toLowerCase()}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            setTooltip(cached);
            return;
        }

        const obtenerInfo = async () => {
            if (!grupo.nombre) return;
            setLoading(true);
            try {
                const res = await fetch("/api/ia", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "llama3-8b-8192",
                        messages: [
                            {
                                role: "user",
                                content: `Responde con 1 líneas: temperatura, humedad y riego ideales para el cultivo de ${grupo.nombre}. Sé concreto.`,
                            },
                        ],
                    }),
                });
                const data = await res.json();
                console.log("💬 Respuesta IA:", data);
                const mensaje = data.mensaje?.trim();

                if (mensaje) {
                    setTooltip(mensaje);
                } else {
                    setTooltip("No se encontraron datos para este cultivo.");
                }
            } catch (err) {
                console.error("❌ Error al obtener info IA:", err);
                setTooltip("Error al obtener información.");
            } finally {
                setLoading(false);
            }
        };

        obtenerInfo();
    }, [grupo.nombre]);


    return (
        <div
            className={`group bg-white border rounded-xl shadow-md p-5 space-y-4 transition-all duration-300 transform hover:scale-102 hover:shadow-lg ${alertaHumedad
                    ? "border-red-400 bg-red-50 hover:border-red-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 relative">
                    {alertaHumedad && (
                        <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
                    )}
                    <h2 className={`text-lg font-semibold ${alertaHumedad ? "text-red-700" : "text-gray-700"}`}>
                        Grupo: {grupo.nombre}
                    </h2>
                    <div className="relative group cursor-pointer">
                        <Info size={18} className="text-blue-500 mt-0.5" />
                        <div className="absolute z-50 mt-2 w-64 p-3 bg-white text-sm text-gray-700 border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {loading ? "Cargando información..." : tooltip || "Sin datos disponibles."}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    <button onClick={() => abrirEdicion("grupo", grupoIndex)} className="text-blue-500 hover:text-blue-600 p-1">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => eliminarGrupo(grupo.nombre)} className="text-red-500 hover:text-red-600 p-1">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {alertaHumedad && (
                <p className="text-sm text-red-600 font-medium bg-red-100 p-2 rounded-md">
                    <AlertTriangle size={16} className="inline mr-1 mb-0.5 text-red-500" />
                    ¡Alerta! Humedad promedio baja: {promedioHumedad.toFixed(1)}%
                </p>
            )}
            <div className="grid gap-4">
                {grupo.sensores.map((sensor) => (
                    <SensorItem
                        key={sensor.id}
                        sensor={sensor}
                        grupoNombre={grupo.nombre}
                        grupoIndex={grupoIndex}
                        abrirEdicion={abrirEdicion}
                        eliminarSensor={eliminarSensor}
                    />
                ))}
            </div>
        </div>
    );
}

function SensorItem({ sensor, grupoNombre, grupoIndex, abrirEdicion, eliminarSensor }) {
    return (
        <div key={sensor.id} className="relative p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 group/sensor">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/sensor:opacity-100 transition-opacity duration-300">
                <button onClick={() => abrirEdicion("sensor", grupoIndex, sensor)} className="text-blue-400 hover:text-blue-600 p-0.5">
                    <Pencil size={16} />
                </button>
                <button onClick={() => eliminarSensor(grupoNombre, sensor.id)} className="text-red-400 hover:text-red-600 p-0.5">
                    <X size={16} />
                </button>
            </div>
            <h3 className="font-medium text-gray-800">{sensor.nombre}</h3>
            <p className="text-sm text-gray-600">Temperatura: <span className="font-semibold">{sensor.temperatura} °C</span></p>
            <p className="text-sm text-gray-600">Humedad: <span className="font-semibold">{sensor.humedad} %</span></p>
        </div>
    );
}

export default function SensorStatusPage() {
    const [grupos, setGrupos] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [modalMapaActivo, setModalMapaActivo] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmMensaje, setConfirmMensaje] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => { });
    const [editVisible, setEditVisible] = useState(false);
    const [editTipo, setEditTipo] = useState("");
    const [editGrupoIndex, setEditGrupoIndex] = useState(null);
    const [editSensorId, setEditSensorId] = useState(null);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        const datosGuardados = localStorage.getItem("gruposSensores");
        if (datosGuardados) {
            try {
                setGrupos(JSON.parse(datosGuardados));
            } catch {
                setGrupos([]); // Podrías inicializar con `grupoInicial` si lo tienes definido
            }
        } else {
            // setGrupos(grupoInicial); // Descomenta si tienes `grupoInicial`
            setGrupos([]);
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem("gruposSensores", JSON.stringify(grupos));
        }
    }, [grupos, loaded]);

    const mostrarConfirmacion = (mensaje, accion) => {
        setConfirmMensaje(mensaje);
        setOnConfirm(() => () => {
            accion();
            setConfirmVisible(false);
        });
        setConfirmVisible(true);
    };

    const eliminarGrupo = (nombreGrupo) => {
        mostrarConfirmacion(`¿Deseas eliminar el grupo "${nombreGrupo}"?`, () => {
            setGrupos(grupos.filter((g) => g.nombre !== nombreGrupo));
        });
    };

    const eliminarSensor = (nombreGrupo, sensorId) => {
        mostrarConfirmacion("¿Deseas eliminar este sensor?", () => {
            setGrupos((prev) =>
                prev.map((grupo) =>
                    grupo.nombre === nombreGrupo
                        ? {
                            ...grupo,
                            sensores: grupo.sensores.filter((s) => s.id !== sensorId),
                        }
                        : grupo
                )
            );
        });
    };

    const abrirEdicion = (tipo, grupoIndex, sensor = null) => {
        setEditTipo(tipo);
        setEditGrupoIndex(grupoIndex);
        if (tipo === "grupo") {
            setEditValues({ nombre: grupos[grupoIndex].nombre });
        } else {
            setEditSensorId(sensor.id);
            setEditValues({ nombre: sensor.nombre });
        }
        setEditVisible(true);
    };

    const guardarEdicion = () => {
        const nuevosGrupos = [...grupos];
        if (editTipo === "grupo") {
            nuevosGrupos[editGrupoIndex].nombre = editValues.nombre;
        } else {
            const sensores = nuevosGrupos[editGrupoIndex].sensores;
            const sensorIndex = sensores.findIndex((s) => s.id === editSensorId);
            sensores[sensorIndex] = {
                ...sensores[sensorIndex],
                nombre: editValues.nombre,
            };
        }
        setGrupos(nuevosGrupos);
        setEditVisible(false);
    };

    const confirmarNuevoGrupo = (grupo) => {
        if (grupos.some((g) => g.nombre.toLowerCase() === grupo.nombre.toLowerCase())) {
            alert("Ya existe un grupo con ese nombre.");
            return;
        }
        setGrupos((prev) => [...prev, grupo]);
        setModalMapaActivo(false);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 px-6 py-10 relative">
            {/* Contenedor discreto para el título y botón */}
            <div className="bg-gray-100 p-4 rounded-lg mb-8 shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-700">Estado de Sensores</h1>
                    <button
                        onClick={() => setModalMapaActivo(true)}
                        className="bg-[#4cd964] text-white px-4 py-2 rounded-xl shadow hover:bg-[#3cc456] transition-all duration-300"
                    >
                        Añadir grupo
                    </button>
                </div>
            </div>

            {modalMapaActivo && (
                <AgregarGrupoDesdeMapa
                    onGrupoConfirmado={confirmarNuevoGrupo}
                    onCancel={() => setModalMapaActivo(false)}
                />
            )}

            {confirmVisible && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{confirmMensaje}</h3>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmVisible(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                                Cancelar
                            </button>
                            <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editVisible && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">Editar {editTipo}</h2>
                        <input
                            className="w-full border border-gray-500 text-gray-800 bg-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4cd964] focus:border-[#4cd964]"
                            type="text"
                            placeholder="Nombre"
                            value={editValues.nombre || ""}
                            onChange={(e) => setEditValues({ ...editValues, nombre: e.target.value })}
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditVisible(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                                Cancelar
                            </button>
                            <button onClick={guardarEdicion} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {grupos.map((grupo, grupoIndex) => {
                    return (
                        <GrupoCard
                            key={grupoIndex}
                            grupo={grupo}
                            grupoIndex={grupoIndex}
                            abrirEdicion={abrirEdicion}
                            eliminarGrupo={eliminarGrupo}
                            eliminarSensor={eliminarSensor} // Pasar la función para eliminar sensores
                        />
                    );
                })}
            </div>
        </div>
    );
}