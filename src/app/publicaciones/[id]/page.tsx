"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export interface Publicacion {
  id: string;
  imagen: string;
  titulo: string;
  fechaCreacion: string;
  contenido: string;
  autorId?: string;
}

export default function FormularioPublicacion() {
  const { id } = useParams();
  const router = useRouter();
  const { estaAutenticado } = useAuth();
  
  const [publicacion, setPublicacion] = useState<Partial<Publicacion>>({
    titulo: "",
    imagen: "",
    contenido: ""
  });
  
  const [error, setError] = useState("");

  useEffect(() => {
    // Protección
    const userGuardado = localStorage.getItem("usuario_actual");
    if (!estaAutenticado && !userGuardado) {
      router.push("/login");
      return;
    }

    // Si no es "nuevo", cargamos los datos para editar
    if (id !== "nuevo") {
      const data = localStorage.getItem("publicaciones");
      if (data) {
        const pubs: Publicacion[] = JSON.parse(data);
        const encontrada = pubs.find(p => p.id === id);
        if (encontrada) {
          setPublicacion(encontrada);
        }
      }
    }
  }, [id, router]);

  const guardar = () => {
    setError("");
    // Validación de campos controlados
    if (!publicacion.titulo || !publicacion.contenido) {
      setError("El título y el contenido son obligatorios");
      return;
    }

    const data = localStorage.getItem("publicaciones");
    let pubs: Publicacion[] = data ? JSON.parse(data) : [];

    if (id === "nuevo") {
      // Crear
      const nueva: Publicacion = {
        id: Date.now().toString(),
        titulo: publicacion.titulo,
        imagen: publicacion.imagen || "",
        contenido: publicacion.contenido,
        fechaCreacion: new Date().toLocaleDateString(),
        autorId: "admin"
      };
      pubs.push(nueva);
    } else {
      // Modificar
      pubs = pubs.map(p => p.id === id ? { ...p, ...publicacion } as Publicacion : p);
    }

    // Persistencia
    localStorage.setItem("publicaciones", JSON.stringify(pubs));
    alert("Publicación guardada exitosamente");
    router.push("/publicaciones"); // Volver a la lista
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>
        {id === "nuevo" ? "📝 Crear Nueva Publicación" : "✏️ Editar Publicación"}
      </h1>

      {error && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: "0.75rem", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", background: "#f8f9fa", padding: "2rem", borderRadius: "8px", border: "1px solid #dee2e6" }}>
        
        {/* Input Controlado */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Título *</label>
          <input 
            type="text" 
            value={publicacion.titulo} 
            onChange={e => setPublicacion({...publicacion, titulo: e.target.value})}
            placeholder="Ej: Ofertas de Primavera"
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        
        {/* Input Controlado */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Ruta de la Imagen</label>
          <input 
            type="text" 
            value={publicacion.imagen} 
            onChange={e => setPublicacion({...publicacion, imagen: e.target.value})}
            placeholder="Ej: /oso_traje.webp"
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        {/* Input Controlado */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Contenido *</label>
          <textarea 
            value={publicacion.contenido} 
            onChange={e => setPublicacion({...publicacion, contenido: e.target.value})}
            placeholder="Escribe la noticia o publicación aquí..."
            style={{ width: "100%", padding: "0.5rem", minHeight: "150px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        {/* Botones de acción */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={guardar} style={{ padding: "0.7rem 1.5rem", background: "#2b7a2b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            💾 Guardar
          </button>
          <button onClick={() => router.push("/publicaciones")} style={{ padding: "0.7rem 1.5rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            ❌ Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
