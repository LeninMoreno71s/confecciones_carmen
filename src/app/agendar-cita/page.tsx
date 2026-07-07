"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCitas } from "../hooks/useCitas";
import Header from "../../../components/header";

export default function AgendarCitaPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, cargandoAuth } = useAuth();
  const {
    agendarCita,
    generarHorariosDisponibles,
    esFechaValida,
    obtenerCitasCliente,
  } = useCitas();

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [fechaError, setFechaError] = useState("");

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!cargandoAuth && !estaAutenticado) {
      router.push("/login?redirect=agendar-cita");
    }
  }, [estaAutenticado, router, cargandoAuth]);

  // Actualizar horarios cuando cambia la fecha
  useEffect(() => {
    if (fecha && esFechaValida(new Date(fecha + "T00:00:00"))) {
      const horarios = generarHorariosDisponibles(fecha);
      setHorariosDisponibles(horarios);
      setFechaError("");
    } else if (fecha) {
      setHorariosDisponibles([]);
      setFechaError("Selecciona una fecha válida (lunes a sábado, próxima semana)");
    }
  }, [fecha]);

  // Obtener fecha mínima (hoy) y máxima (7 días después)
  const hoy = new Date();
  const fechaMaxima = new Date();
  fechaMaxima.setDate(fechaMaxima.getDate() + 7);

  const fechaMinStr = hoy.toISOString().split("T")[0];
  const fechaMaxStr = fechaMaxima.toISOString().split("T")[0];

  const citasCliente = obtenerCitasCliente();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!fecha || !hora || !motivo.trim()) {
      setMensaje({ tipo: "error", texto: "Todos los campos son obligatorios" });
      return;
    }

    if (motivo.trim().length < 10) {
      setMensaje({
        tipo: "error",
        texto: "El motivo debe tener al menos 10 caracteres",
      });
      return;
    }

    const resultado = await agendarCita(fecha, hora, motivo);

    if (resultado.exito) {
      setMensaje({ tipo: "exito", texto: resultado.mensaje });
      setFecha("");
      setHora("");
      setMotivo("");
    } else {
      setMensaje({ tipo: "error", texto: resultado.mensaje });
    }
  };

  return (
    <main>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #F5F0E8 0%, #E8D5B7 100%)",
          padding: "6rem 2rem 2rem 2rem",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#2b7a2b",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            📅 Agendar Cita Presencial
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#6c757d",
              marginBottom: "2rem",
            }}
          >
            Selecciona una fecha y hora disponible para tu visita
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* FORMULARIO DE AGENDAMIENTO */}
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <h5 style={{ marginBottom: "1.5rem", color: "#333" }}>
                📅 Nueva Cita
              </h5>

              {mensaje && (
                <div
                  style={{
                    background: mensaje.tipo === "exito" ? "#d4edda" : "#f8d7da",
                    color: mensaje.tipo === "exito" ? "#155724" : "#721c24",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {mensaje.tipo === "exito" ? "✅" : "❌"} {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Fecha */}
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.4rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    min={fechaMinStr}
                    max={fechaMaxStr}
                    required
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                  />
                  {fechaError && (
                    <small style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                      ⚠️ {fechaError}
                    </small>
                  )}
                  <small style={{ color: "#6c757d", fontSize: "0.75rem", display: "block" }}>
                    Solo lunes a sábado, próxima semana
                  </small>
                </div>

                {/* Hora */}
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.4rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Hora *
                  </label>
                  {horariosDisponibles.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                        gap: "0.5rem",
                      }}
                    >
                      {horariosDisponibles.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHora(h)}
                          style={{
                            padding: "0.5rem",
                            border:
                              hora === h
                                ? "2px solid #2b7a2b"
                                : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            background: hora === h ? "#d4edda" : "white",
                            cursor: "pointer",
                            fontWeight: hora === h ? 700 : 400,
                            fontSize: "0.85rem",
                            transition: "all 0.2s",
                          }}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  ) : fecha ? (
                    <p style={{ color: "#dc3545", fontSize: "0.9rem" }}>
                      No hay horarios disponibles para esta fecha
                    </p>
                  ) : (
                    <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                      Primero selecciona una fecha
                    </p>
                  )}
                  <small style={{ color: "#6c757d", fontSize: "0.75rem", display: "block" }}>
                    Horario: 10:00 AM a 7:00 PM
                  </small>
                </div>

                {/* Motivo */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.4rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    Motivo de la cita *
                  </label>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Describe brevemente el motivo de tu visita (mínimo 10 caracteres)"
                    rows={4}
                    maxLength={500}
                    required
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                  <small style={{ color: "#6c757d", fontSize: "0.75rem" }}>
                    {motivo.length}/500 caracteres
                  </small>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  📅 Agendar Cita
                </button>
              </form>
            </div>

            {/* MIS CITAS */}
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <h5 style={{ marginBottom: "1.5rem", color: "#333" }}>
                📋 Mis Citas
              </h5>

              {citasCliente.length === 0 ? (
                <p style={{ color: "#6c757d", textAlign: "center", padding: "2rem 0" }}>
                  No tienes citas agendadas
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {citasCliente.map((cita) => (
                    <div
                      key={cita.id}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        padding: "1rem",
                        borderLeft: `4px solid ${
                          cita.estado === "aceptada"
                            ? "#198754"
                            : cita.estado === "rechazada"
                            ? "#dc3545"
                            : "#ffc107"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <strong style={{ fontSize: "0.9rem" }}>
                          📅 {new Date(cita.fecha + "T00:00:00").toLocaleDateString("es-CL")}
                        </strong>
                        <span
                          style={{
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background:
                              cita.estado === "aceptada"
                                ? "#d4edda"
                                : cita.estado === "rechazada"
                                ? "#f8d7da"
                                : "#fff3cd",
                            color:
                              cita.estado === "aceptada"
                                ? "#155724"
                                : cita.estado === "rechazada"
                                ? "#721c24"
                                : "#856404",
                          }}
                        >
                          {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "#6c757d", margin: "0.25rem 0" }}>
                        🕐 {cita.hora} hrs
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "#333", margin: "0.25rem 0" }}>
                        {cita.motivo}
                      </p>
                      {cita.adminComentario && (
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "#6c757d",
                            fontStyle: "italic",
                            marginTop: "0.5rem",
                            padding: "0.5rem",
                            background: "#f8f9fa",
                            borderRadius: "4px",
                          }}
                        >
                          💬 Admin: {cita.adminComentario}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}