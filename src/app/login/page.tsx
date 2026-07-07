"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { iniciarSesionUsuario } from "../../lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // 1. Verificar si es el ADMINISTRADOR (mantenemos esto igual)
    if (email === "admin@confeccionescarmen.cl" && password === "admin123") {
      const adminData = {
        uid: "admin-001",
        nombre: "Administrador",
        apellido: "Sistema",
        correo: "admin@confeccionescarmen.cl",
        telefono: "",
        rol: "admin",
      };
      localStorage.setItem("usuario_actual", JSON.stringify(adminData));
      setCargando(false);
      window.location.href = "/dashboard";
      return;
    }

    // 2. Usar Firebase Auth para clientes
    const resultado = await iniciarSesion(email, password);
    setCargando(false);

    if (resultado.exito) {
      router.push("/?login=exitoso");
    } else {
      setError(resultado.error || "Credenciales incorrectas");
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
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", color: "white", fontSize: "2rem"
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

        {error && (
          <div style={{
            background: "#f8d7da", color: "#721c24", padding: "0.75rem",
            borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center"
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem", color: "#495057" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.cl"
              required
              style={{
                width: "100%", padding: "0.75rem", border: "2px solid #dee2e6",
                borderRadius: "8px", fontSize: "0.95rem", outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem", color: "#495057" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%", padding: "0.75rem", border: "2px solid #dee2e6",
                borderRadius: "8px", fontSize: "0.95rem", outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%", padding: "0.75rem",
              background: cargando ? "#6c757d" : "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "1rem", fontWeight: 600, cursor: cargando ? "not-allowed" : "pointer"
            }}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#6c757d" }}>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" style={{ color: "#8B3A4A", fontWeight: 600, textDecoration: "none" }}>
            Crear Cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}