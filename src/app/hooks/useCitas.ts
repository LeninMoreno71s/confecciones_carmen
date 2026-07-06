"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  agregarDocumento,
  obtenerTodos,
  actualizarDocumento,
  eliminarDocumento,
  buscarPorCampo,
} from "../../lib/firestore";

interface Cita {
  id?: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  fechaCreacion?: string;
  adminComentario?: string;
}

export function useCitas() {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar citas de Firestore al iniciar
  const cargarCitas = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerTodos("citas");
    if (resultado.exito) {
      setCitas(resultado.datos);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  // Agendar nueva cita
  const agendarCita = async (fecha: string, hora: string, motivo: string) => {
    if (!usuario) {
      return { exito: false, mensaje: "Debes iniciar sesión para agendar una cita" };
    }

    // Verificar si ya tiene una cita en esa misma fecha y hora
    const citaExistente = citas.find(
      (c) =>
        c.clienteId === usuario.id &&
        c.fecha === fecha &&
        c.hora === hora &&
        c.estado !== "rechazada"
    );
    if (citaExistente) {
      return { exito: false, mensaje: "Ya tienes una cita en esta fecha y hora" };
    }

    const nuevaCita = {
      clienteId: usuario.id,
      clienteNombre: `${usuario.nombre} ${usuario.apellido}`,
      clienteEmail: usuario.correo,
      fecha,
      hora,
      motivo: motivo.trim(),
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    };

    const resultado = await agregarDocumento("citas", nuevaCita);
    if (resultado.exito) {
      await cargarCitas();
      return { exito: true, mensaje: "Cita agendada con éxito" };
    }
    return { exito: false, mensaje: "Error al agendar la cita" };
  };

  // Aceptar cita (admin)
  const aceptarCita = async (citaId: string, comentario?: string) => {
    await actualizarDocumento("citas", citaId, {
      estado: "aceptada",
      adminComentario: comentario || "",
    });
    await cargarCitas();
  };

  // Rechazar cita (admin)
  const rechazarCita = async (citaId: string, comentario?: string) => {
    await actualizarDocumento("citas", citaId, {
      estado: "rechazada",
      adminComentario: comentario || "",
    });
    await cargarCitas();
  };

  // Obtener citas del cliente actual
  const obtenerCitasCliente = () => {
    if (!usuario) return [];
    return citas.filter((c) => c.clienteId === usuario.id);
  };

  // Obtener todas las citas (admin)
  const obtenerTodasCitas = () => {
    return [...citas].sort(
      (a, b) => new Date(b.fechaCreacion || "").getTime() - new Date(a.fechaCreacion || "").getTime()
    );
  };

  // Generar horarios disponibles
  const generarHorariosDisponibles = (fecha: string): string[] => {
    const horasOcupadas = citas
      .filter((c) => c.fecha === fecha && c.estado === "aceptada")
      .map((c) => c.hora);

    const horarios: string[] = [];
    for (let h = 10; h <= 18; h++) {
      const horaStr = `${h.toString().padStart(2, "0")}:00`;
      if (!horasOcupadas.includes(horaStr)) {
        horarios.push(horaStr);
      }
    }
    return horarios;
  };

  // Validar fecha
  const esFechaValida = (fecha: Date): boolean => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSel = new Date(fecha);
    fechaSel.setHours(0, 0, 0, 0);

    const diaSemana = fechaSel.getDay();
    if (diaSemana === 0) return false; // No domingos

    const diffTime = fechaSel.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return {
    citas,
    cargando,
    agendarCita,
    aceptarCita,
    rechazarCita,
    obtenerCitasCliente,
    obtenerTodasCitas,
    generarHorariosDisponibles,
    esFechaValida,
    recargarCitas: cargarCitas,
  };
}