"use client";

import React, { useEffect, useState } from "react";
import { Trash2, X, Pencil } from "lucide-react";
import dynamic from "next/dynamic";

const AgregarGrupoDesdeMapa = dynamic(() => import("@/components/AgregarGrupoDesdeMapa"), {
    ssr: false,
});

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
                setGrupos([]);
            }
        } else {
            setGrupos(grupoInicial);
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Estado de Sensores</h1>
                <button
                    onClick={() => setModalMapaActivo(true)}
                    className="bg-[#4cd964] text-white px-4 py-2 rounded-xl shadow hover:bg-[#3cc456]"
                >
                    Añadir grupo
                </button>
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
                {grupos.map((grupo, grupoIndex) => (
                    <div key={grupoIndex} className="bg-white border border-gray-200 rounded-xl shadow-md p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-700">Grupo: {grupo.nombre}</h2>
                            <div className="flex gap-2">
                                <button onClick={() => abrirEdicion("grupo", grupoIndex)} className="text-blue-500 hover:text-blue-600">
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => eliminarGrupo(grupo.nombre)} className="text-red-500 hover:text-red-600">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {grupo.sensores.map((sensor) => (
                                <div key={sensor.id} className="relative p-3 border rounded-lg bg-gray-50">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => abrirEdicion("sensor", grupoIndex, sensor)} className="text-blue-400 hover:text-blue-600">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => eliminarSensor(grupo.nombre, sensor.id)} className="text-red-400 hover:text-red-600">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <h3 className="font-medium text-gray-800">{sensor.nombre}</h3>
                                    <p className="text-sm text-gray-600">Temperatura: <span className="font-semibold">{sensor.temperatura} °C</span></p>
                                    <p className="text-sm text-gray-600">Humedad: <span className="font-semibold">{sensor.humedad} %</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}