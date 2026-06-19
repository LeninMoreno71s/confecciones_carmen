"use client";

import { useState, useEffect } from "react";
import { Cita } from "../../../types/cita";
import { useAuth } from "../context/AuthContext";

export function useCitas() {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);

  // Cargar citas del localStorage al iniciar
  useEffect(() => {
    const citasGuardadas = JSON.parse(
      localStorage.getItem("citas") || "[]"
    );
    setCitas(citasGuardadas);
  }, []);

  // Guardar citas en localStorage
  const guardarCitas = (nuevasCitas: Cita[]) => {
    localStorage.setItem("citas", JSON.stringify(nuevasCitas));
    setCitas(nuevasCitas);
  };

  // Agendar nueva cita (cliente)
  const agendarCita = (
    fecha: string,
    hora: string,
    motivo: string
  ): { exito: boolean; mensaje: string } => {
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
      return {
        exito: false,
        mensaje: "Ya tienes una cita agendada en esta fecha y hora",
      };
    }

    // Verificar si la hora ya está ocupada por otro cliente
    const horaOcupada = citas.find(
      (c) =>
        c.fecha === fecha &&
        c.hora === hora &&
        c.estado === "aceptada"
    );

    if (horaOcupada) {
      return {
        exito: false,
        mensaje: "Esta hora ya está reservada. Por favor elige otra.",
      };
    }

    const nuevaCita: Cita = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      clienteId: usuario.id,
      clienteNombre: `${usuario.nombre} ${usuario.apellido}`,
      clienteEmail: usuario.correo,
      fecha,
      hora,
      motivo: motivo.trim(),
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    };

    const nuevasCitas = [...citas, nuevaCita];
    guardarCitas(nuevasCitas);

    return {
      exito: true,
      mensaje: "Cita agendada con éxito. El administrador la revisará pronto.",
    };
  };

  // Obtener citas del cliente actual
  const obtenerCitasCliente = (): Cita[] => {
    if (!usuario) return [];
    return citas.filter((c) => c.clienteId === usuario.id);
  };

  // Obtener todas las citas (admin)
  const obtenerTodasCitas = (): Cita[] => {
    return citas.sort(
      (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  };

  // Aceptar cita (admin)
  const aceptarCita = (citaId: string, comentario?: string) => {
    const nuevasCitas = citas.map((c) =>
      c.id === citaId
        ? { ...c, estado: "aceptada" as const, adminComentario: comentario || "" }
        : c
    );
    guardarCitas(nuevasCitas);
  };

  // Rechazar cita (admin)
  const rechazarCita = (citaId: string, comentario?: string) => {
    const nuevasCitas = citas.map((c) =>
      c.id === citaId
        ? { ...c, estado: "rechazada" as const, adminComentario: comentario || "" }
        : c
    );
    guardarCitas(nuevasCitas);
  };

  // Obtener horas ocupadas para una fecha
  const obtenerHorasOcupadas = (fecha: string): string[] => {
    return citas
      .filter((c) => c.fecha === fecha && c.estado === "aceptada")
      .map((c) => c.hora);
  };

  // Generar horarios disponibles (10:00 a 19:00, cada 1 hora)
  const generarHorariosDisponibles = (fecha: string): string[] => {
    const horasOcupadas = obtenerHorasOcupadas(fecha);
    const horarios: string[] = [];

    for (let h = 10; h <= 18; h++) {
      const horaStr = `${h.toString().padStart(2, "0")}:00`;
      if (!horasOcupadas.includes(horaStr)) {
        horarios.push(horaStr);
      }
    }

    return horarios;
  };

  // Validar si una fecha es válida para agendar (lunes a sábado, con 1 semana de anticipación)
  const esFechaValida = (fecha: Date): boolean => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaSeleccionada = new Date(fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    // No puede ser domingo (0 = domingo)
    const diaSemana = fechaSeleccionada.getDay();
    if (diaSemana === 0) return false;

    // Calcular diferencia en días
    const diffTime = fechaSeleccionada.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Debe ser entre hoy y 7 días después
    return diffDays >= 0 && diffDays <= 7;
  };

  return {
    citas,
    agendarCita,
    obtenerCitasCliente,
    obtenerTodasCitas,
    aceptarCita,
    rechazarCita,
    generarHorariosDisponibles,
    esFechaValida,
    obtenerHorasOcupadas,
  };
}