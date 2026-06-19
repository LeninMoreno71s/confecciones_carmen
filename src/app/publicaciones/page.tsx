"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export interface Publicacion {
  id: string;
  imagen: string;
  titulo: string;
  fechaCreacion: string;
  contenido: string;
  autorId?: string;
}

export default function PublicacionesPage() {
  const router = useRouter();
  const { estaAutenticado } = useAuth();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Protección de ruta básica
    const userGuardado = localStorage.getItem("usuario_actual");
    if (!estaAutenticado && !userGuardado) {
      router.push("/login");
      return;
    }

    // Cargar datos
    const data = localStorage.getItem("publicaciones");
    if (data) {
      setPublicaciones(JSON.parse(data));
    } else {
      // Mock inicial si está vacío
      const iniciales: Publicacion[] = [
        { id: "1", imagen: "/oso_traje.webp", titulo: "Nueva Colección", fechaCreacion: "15/06/2026", contenido: "Nuevos diseños disponibles...", autorId: "admin" }
      ];
      setPublicaciones(iniciales);
      localStorage.setItem("publicaciones", JSON.stringify(iniciales));
    }
  }, [router]);

  // Eliminar
  const eliminarPublicacion = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta publicación?")) {
      const filtradas = publicaciones.filter(p => p.id !== id);
      setPublicaciones(filtradas);
      localStorage.setItem("publicaciones", JSON.stringify(filtradas));
    }
  };

  // Buscar
  const resultados = publicaciones.filter(p => 
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📰 Administración de Publicaciones</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", marginTop: "1.5rem" }}>
        <Link href="/dashboard">
          <button style={{ padding: "0.5rem 1rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            ⬅️ Volver al Dashboard
          </button>
        </Link>
        <Link href="/publicaciones/nuevo">
          <button style={{ padding: "0.5rem 1rem", background: "#2b7a2b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            ➕ Crear Publicación
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por título..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", maxWidth: "300px", border: "1px solid #ccc", borderRadius: "4px" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
            <th style={{ padding: "0.75rem", borderBottom: "2px solid #dee2e6" }}>ID</th>
            <th style={{ padding: "0.75rem", borderBottom: "2px solid #dee2e6" }}>Título</th>
            <th style={{ padding: "0.75rem", borderBottom: "2px solid #dee2e6" }}>Fecha</th>
            <th style={{ padding: "0.75rem", borderBottom: "2px solid #dee2e6" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map(p => (
            <tr key={p.id} style={{ borderBottom: "1px solid #dee2e6" }}>
              <td style={{ padding: "0.75rem" }}>{p.id}</td>
              <td style={{ padding: "0.75rem" }}>{p.titulo}</td>
              <td style={{ padding: "0.75rem" }}>{p.fechaCreacion}</td>
              <td style={{ padding: "0.75rem" }}>
                <Link href={`/publicaciones/${p.id}`}>
                  <button style={{ marginRight: "0.5rem", padding: "0.3rem 0.6rem", cursor: "pointer" }}>✏️ Editar</button>
                </Link>
                <button onClick={() => eliminarPublicacion(p.id)} style={{ padding: "0.3rem 0.6rem", cursor: "pointer" }}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
          {resultados.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "1rem", textAlign: "center", color: "#6c757d" }}>
                No se encontraron publicaciones.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
