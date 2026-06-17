"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simulación de autenticación (reemplazar con lógica real)
    if (email === "admin@confeccionescarmen.cl" && password === "admin123") {
      router.push("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #F5F0E8 0%, #E8D5B7 100%)",
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            color: "white",
            fontSize: "2rem"
          }}>
            🧵
          </div>
          <h1 style={{ fontSize: "1.5rem", color: "#2b7a2b", fontWeight: 700 }}>
            Confecciones Carmen
          </h1>
          <p style={{ color: "#6c757d", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Intranet - Acceso restringido
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#495057"
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@confeccionescarmen.cl"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #dee2e6",
                borderRadius: "8px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2b7a2b"}
              onBlur={(e) => e.target.style.borderColor = "#dee2e6"}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#495057"
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #dee2e6",
                borderRadius: "8px",
                fontSize: "0.95rem",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2b7a2b"}
              onBlur={(e) => e.target.style.borderColor = "#dee2e6"}
            />
          </div>

          {error && (
            <div style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

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
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            Iniciar Sesión
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.8rem",
          color: "#6c757d"
        }}>
          ¿Olvidaste tu contraseña? Contacta al administrador
        </p>
      </div>
    </div>
  );
}