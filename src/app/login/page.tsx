"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // 1. Verificar si es el ADMINISTRADOR
    if (email === "admin@confeccionescarmen.cl" && password === "admin123") {
      // Guardar sesión de admin en localStorage
      const adminData = {
        id: "admin-001",
        nombre: "Administrador",
        apellido: "Sistema",
        correo: "admin@confeccionescarmen.cl",
        telefono: "",
        rol: "admin",
      };
      localStorage.setItem("usuario_actual", JSON.stringify(adminData));
      setCargando(false);
      // Forzamos la recarga completa para que AuthContext lea el localStorage nuevamente
      window.location.href = "/dashboard";
      return;
    }

    // 2. Verificar si es un CLIENTE registrado
    const resultado = iniciarSesion(email, password);
    setCargando(false);

    if (resultado) {
      // Redirigir a la página principal
      router.push("/?login=exitoso");
    } else {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
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
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Mensaje de registro exitoso */}
        {typeof window !== "undefined" && 
         new URLSearchParams(window.location.search).get("registro") === "exitoso" && (
          <div style={{
            background: "#d4edda",
            color: "#155724",
            padding: "0.75rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            ✅ ¡Cuenta creada con éxito! Ahora inicia sesión
          </div>
        )}

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
              placeholder="correo@ejemplo.cl"
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
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: cargando 
                ? "#6c757d" 
                : "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: cargando ? "not-allowed" : "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseOver={(e) => {
              if (!cargando) e.currentTarget.style.opacity = "0.9";
            }}
            onMouseOut={(e) => {
              if (!cargando) e.currentTarget.style.opacity = "1";
            }}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Enlace para crear cuenta */}
        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.9rem",
          color: "#6c757d"
        }}>
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            style={{
              color: "#8B3A4A",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Crear Cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}