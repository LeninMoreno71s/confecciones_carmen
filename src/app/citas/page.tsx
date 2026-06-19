"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCitas } from "../hooks/useCitas";
import { Cita } from "../../../types/cita";
import { useAuth } from "../context/AuthContext";

export default function CitasAdminPage() {
  const router = useRouter();
  const { obtenerTodasCitas, aceptarCita, rechazarCita } = useCitas();
  const [comentario, setComentario] = useState("");
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [accionPendiente, setAccionPendiente] = useState<"aceptar" | "rechazar" | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");

  const todasCitas = obtenerTodasCitas();

  const citasFiltradas =
    filtroEstado === "todas"
      ? todasCitas
      : todasCitas.filter((c) => c.estado === filtroEstado);

  const handleAceptar = () => {
    if (citaSeleccionada) {
      aceptarCita(citaSeleccionada.id, comentario);
      setComentario("");
      setCitaSeleccionada(null);
      setAccionPendiente(null);
    }
  };

  const handleRechazar = () => {
    if (citaSeleccionada) {
      rechazarCita(citaSeleccionada.id, comentario);
      setComentario("");
      setCitaSeleccionada(null);
      setAccionPendiente(null);
    }
  };

  const abrirModal = (cita: Cita, accion: "aceptar" | "rechazar") => {
    setCitaSeleccionada(cita);
    setAccionPendiente(accion);
    setComentario("");
  };

  const cerrarModal = () => {
    setCitaSeleccionada(null);
    setAccionPendiente(null);
    setComentario("");
  };

  const contarPorEstado = (estado: string) => {
    return todasCitas.filter((c) => c.estado === estado).length;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#2b7a2b",
            marginBottom: "0.5rem",
          }}
        >
          📋 Gestión de Citas
        </h1>
        <p style={{ color: "#6c757d", marginBottom: "2rem" }}>
          Administra las citas solicitadas por los clientes
        </p>
        {/* Botón para volver al panel admin */}

        <button
          onClick={() => router.push("/dashboard")}
          style={{
            marginTop: "2rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3FA572",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ⬅️ Volver al Panel Admin
        </button>


        {/* TARJETAS DE ESTADÍSTICAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2b7a2b" }}>
              {todasCitas.length}
            </div>
            <small style={{ color: "#6c757d" }}>Total Citas</small>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderTop: "3px solid #ffc107",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#856404" }}>
              {contarPorEstado("pendiente")}
            </div>
            <small style={{ color: "#6c757d" }}>Pendientes</small>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderTop: "3px solid #198754",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#155724" }}>
              {contarPorEstado("aceptada")}
            </div>
            <small style={{ color: "#6c757d" }}>Aceptadas</small>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              borderTop: "3px solid #dc3545",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#721c24" }}>
              {contarPorEstado("rechazada")}
            </div>
            <small style={{ color: "#6c757d" }}>Rechazadas</small>
          </div>
        </div>

        {/* FILTROS */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {["todas", "pendiente", "aceptada", "rechazada"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              style={{
                padding: "0.5rem 1.2rem",
                border: filtroEstado === estado ? "2px solid #2b7a2b" : "2px solid #e0e0e0",
                borderRadius: "8px",
                background: filtroEstado === estado ? "#d4edda" : "white",
                cursor: "pointer",
                fontWeight: filtroEstado === estado ? 600 : 400,
                fontSize: "0.9rem",
              }}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
              {estado !== "todas" && ` (${contarPorEstado(estado)})`}
            </button>
          ))}
        </div>

        {/* TABLA DE CITAS */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #e0e0e0" }}>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Hora</th>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Motivo</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
                      No hay citas {filtroEstado !== "todas" ? filtroEstado + "s" : ""}
                    </td>
                  </tr>
                ) : (
                  citasFiltradas.map((cita) => (
                    <tr key={cita.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={tdStyle}>
                        {new Date(cita.fecha + "T00:00:00").toLocaleDateString("es-CL")}
                      </td>
                      <td style={tdStyle}>{cita.hora} hrs</td>
                      <td style={tdStyle}>{cita.clienteNombre}</td>
                      <td style={tdStyle}>{cita.clienteEmail}</td>
                      <td style={tdStyle}>{cita.motivo}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            fontSize: "0.8rem",
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
                      </td>
                      <td style={tdStyle}>
                        {cita.estado === "pendiente" ? (
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <button
                              onClick={() => abrirModal(cita, "aceptar")}
                              style={{
                                padding: "0.3rem 0.7rem",
                                background: "#198754",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              ✓ Aceptar
                            </button>
                            <button
                              onClick={() => abrirModal(cita, "rechazar")}
                              style={{
                                padding: "0.3rem 0.7rem",
                                background: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              ✕ Rechazar
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                            {cita.adminComentario || "Sin comentarios"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {citaSeleccionada && accionPendiente && (
        <div
          onClick={cerrarModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h4
              style={{
                marginBottom: "1rem",
                color: accionPendiente === "aceptar" ? "#198754" : "#dc3545",
              }}
            >
              {accionPendiente === "aceptar" ? "✅" : "❌"}{" "}
              {accionPendiente === "aceptar" ? "Aceptar" : "Rechazar"} Cita
            </h4>

            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                <strong>Cliente:</strong> {citaSeleccionada.clienteNombre}
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                <strong>Fecha:</strong>{" "}
                {new Date(citaSeleccionada.fecha + "T00:00:00").toLocaleDateString("es-CL")}
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                <strong>Hora:</strong> {citaSeleccionada.hora} hrs
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                <strong>Motivo:</strong> {citaSeleccionada.motivo}
              </p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                  fontSize: "0.9rem",
                }}
              >
                Comentario (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Agrega un comentario para el cliente..."
                rows={3}
                maxLength={300}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                onClick={cerrarModal}
                style={{
                  padding: "0.6rem 1.5rem",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={accionPendiente === "aceptar" ? handleAceptar : handleRechazar}
                style={{
                  padding: "0.6rem 1.5rem",
                  background: accionPendiente === "aceptar" ? "#198754" : "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {accionPendiente === "aceptar" ? "✓ Confirmar Aceptar" : "✕ Confirmar Rechazar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Estilos para la tabla
const thStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.85rem",
  color: "#495057",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.9rem",
  color: "#333",
};