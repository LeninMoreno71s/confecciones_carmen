"use client";

import Link from "next/link";
import { useAuth } from "../src/app/context/AuthContext";
import type { CSSProperties } from "react";

const botonVerde: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.85rem 2rem",
  background: "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: 600,
  textDecoration: "none",
  boxShadow: "0 4px 16px rgba(43, 122, 43, 0.3)",
  transition: "transform 0.2s",
};
export default function Header() {
  const { usuario, estaAutenticado, cerrarSesion } = useAuth();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "0.75rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo / Nombre */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          color: "#2b7a2b",
          fontWeight: 700,
          fontSize: "1.2rem",
        }}
      >
        🧵 Confecciones Carmen
      </Link>

      {/* Lado derecho */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {estaAutenticado && usuario ? (
          <>
            {/* Nombre del usuario */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#f0f8f0",
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                border: "1px solid #d4edda",
              }}
            >
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {usuario.nombre.charAt(0).toUpperCase()}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.9rem",
                }}
              >
                {usuario.nombre} {usuario.apellido}
              </span>
            </div>
            <Link href="/carrito" style={botonVerde}>
                  🛒 Ver Carrito
                </Link>

            {/* Botón Panel Admin (solo si es admin) */}
            {usuario.rol === "admin" && (
              <Link
                href="/dashboard"
                style={{
                  padding: "0.5rem 1.2rem",
                  background: "#FFD700",
                  color: "#000",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                ⚙️ Panel Admin
              </Link>
            )}

            {/* Botón cerrar sesión */}
            <button
              onClick={cerrarSesion}
              style={{
                background: "transparent",
                border: "1px solid #dc3545",
                color: "#dc3545",
                padding: "0.4rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#dc3545";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#dc3545";
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* Botones cuando NO hay sesión */}
            <Link
              href="/registro"
              style={{
                padding: "0.5rem 1.2rem",
                border: "2px solid #8B3A4A",
                color: "#8B3A4A",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Crear Cuenta
            </Link>
            <Link
              href="/login"
              style={{
                padding: "0.5rem 1.2rem",
                background: "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
                color: "white",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Iniciar Sesión
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
