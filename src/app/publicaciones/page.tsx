"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { obtenerTodos, eliminarDocumento } from "../..//lib/firestore";

interface Publicacion {
  id: string;
  titulo: string;
  contenido: string;
  imagen: string;
  fechaCreacion: string;
  autorId?: string;
}

export default function PublicacionesPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, cargandoAuth } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Protección y carga de datos
  useEffect(() => {
    if (!cargandoAuth && (!estaAutenticado || usuario?.rol !== "admin")) {
      router.push("/login");
      return;
    }

    async function cargarPublicaciones() {
      setCargando(true);
      const resultado = await obtenerTodos("publicaciones");
      if (resultado.exito) {
        setPublicaciones(resultado.datos);
      }
      setCargando(false);
    }

    if (estaAutenticado && usuario?.rol === "admin") {
      cargarPublicaciones();
    }
  }, [estaAutenticado, usuario, router, cargandoAuth]);

  // Eliminar publicación
  const eliminarPublicacion = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      const resultado = await eliminarDocumento("publicaciones", id);
      if (resultado.exito) {
        // Actualizar lista local
        setPublicaciones(publicaciones.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar la publicación");
      }
    }
  };

  // Filtrar publicaciones por búsqueda
  const publicacionesFiltradas = publicaciones.filter(
    (p) =>
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.contenido.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Loader
  if (cargandoAuth || cargando) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F5F0E8 0%, #E8D5B7 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F5F0E8 0%, #E8D5B7 100%)",
      padding: "2rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Encabezado */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <h1 style={{ color: "#2b7a2b", fontSize: "2rem", margin: 0 }}>
            📰 Gestión de Publicaciones
          </h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{
              padding: "0.6rem 1.2rem",
              background: "#6c757d",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}>
              📊 Dashboard
            </Link>
            <Link href="/publicaciones/nuevo" style={{
              padding: "0.6rem 1.2rem",
              background: "#2b7a2b",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}>
              ➕ Nueva Publicación
            </Link>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar por título o contenido..."
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "0.7rem 1rem",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#2b7a2b"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>

        {/* Tabla de publicaciones */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #e0e0e0" }}>
                  <th style={thStyle}>Título</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Imagen</th>
                  <th style={thStyle}>Vista previa</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {publicacionesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
                      {busqueda ? "No se encontraron publicaciones" : "No hay publicaciones. ¡Crea la primera!"}
                    </td>
                  </tr>
                ) : (
                  publicacionesFiltradas.map((pub) => (
                    <tr key={pub.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={tdStyle}>
                        <strong>{pub.titulo}</strong>
                      </td>
                      <td style={tdStyle}>{pub.fechaCreacion}</td>
                      <td style={tdStyle}>
                        {pub.imagen ? (
                          <img
                            src={pub.imagen}
                            alt={pub.titulo}
                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        ) : (
                          <span style={{ color: "#6c757d" }}>Sin imagen</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                          {pub.contenido?.substring(0, 100)}{pub.contenido?.length > 100 ? "..." : ""}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Link
                            href={`/publicaciones/${pub.id}`}
                            style={{
                              padding: "0.3rem 0.7rem",
                              background: "#0d6efd",
                              color: "white",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontSize: "0.8rem",
                              fontWeight: 600
                            }}
                          >
                            ✏️ Editar
                          </Link>
                          <button
                            onClick={() => eliminarPublicacion(pub.id)}
                            style={{
                              padding: "0.3rem 0.7rem",
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#6c757d", fontSize: "0.9rem" }}>
          Total: {publicacionesFiltradas.length} publicación(es)
        </p>
      </div>
    </main>
  );
}

// Estilos de tabla
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