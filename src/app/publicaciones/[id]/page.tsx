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
  const { usuario, estaAutenticado, cargandoAuth } = useAuth();
  
  const [publicacion, setPublicacion] = useState<Partial<Publicacion>>({
    titulo: "",
    imagen: "",
    contenido: ""
  });
  
  const [error, setError] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    // Protección estricta: Solo Admin
    if (!cargandoAuth && (!estaAutenticado || usuario?.rol !== "admin")) {
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
  }, [id, router, cargandoAuth, estaAutenticado, usuario]);

  const guardar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    if (!publicacion.titulo || !publicacion.contenido || (id === "nuevo" && !archivo)) {
      setError("Todos los campos son obligatorios (Título, Imagen y Contenido)");
      return;
    }

    setSubiendo(true);
    let rutaImagen = publicacion.imagen || "";

    // Subir archivo si se seleccionó uno
    if (archivo) {
      const formData = new FormData();
      formData.append("file", archivo);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const dataUpload = await res.json();
        
        if (dataUpload.success) {
          rutaImagen = dataUpload.url;
        } else {
          setError(dataUpload.error || "Error al subir la imagen");
          setSubiendo(false);
          return;
        }
      } catch (err) {
        setError("Error de conexión al subir la imagen");
        setSubiendo(false);
        return;
      }
    }

    const data = localStorage.getItem("publicaciones");
    let pubs: Publicacion[] = data ? JSON.parse(data) : [];

    if (id === "nuevo") {
      // Crear
      const nueva: Publicacion = {
        id: Date.now().toString(),
        titulo: publicacion.titulo,
        imagen: rutaImagen,
        contenido: publicacion.contenido,
        fechaCreacion: new Date().toLocaleDateString(),
        autorId: "admin"
      };
      pubs.push(nueva);
    } else {
      // Modificar
      pubs = pubs.map(p => p.id === id ? { ...p, ...publicacion, imagen: rutaImagen } as Publicacion : p);
    }

    // Persistencia
    localStorage.setItem("publicaciones", JSON.stringify(pubs));
    setSubiendo(false);
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

      <form onSubmit={guardar} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", background: "#f8f9fa", padding: "2rem", borderRadius: "8px", border: "1px solid #dee2e6" }}>
        
        {/* Input Controlado */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Título *</label>
          <input 
            type="text" 
            value={publicacion.titulo} 
            onChange={e => setPublicacion({...publicacion, titulo: e.target.value})}
            placeholder="Ej: Ofertas de Primavera"
            required
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        
        {/* Input Controlado - Archivo */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Imagen de Portada *</label>
          {publicacion.imagen && (
            <div style={{ marginBottom: "0.5rem" }}>
              <img src={publicacion.imagen} alt="Vista previa" style={{ maxWidth: "200px", borderRadius: "4px" }} />
              <p style={{ fontSize: "0.8rem", color: "#666" }}>Actual: {publicacion.imagen}</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setArchivo(e.target.files[0]);
              }
            }}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
            required={id === "nuevo"}
          />
        </div>

        {/* Input Controlado */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Contenido *</label>
          <textarea 
            value={publicacion.contenido} 
            onChange={e => setPublicacion({...publicacion, contenido: e.target.value})}
            placeholder="Escribe la noticia o publicación aquí..."
            required
            style={{ width: "100%", padding: "0.5rem", minHeight: "150px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        {/* Botones de acción */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" disabled={subiendo} style={{ padding: "0.7rem 1.5rem", background: subiendo ? "#ccc" : "#2b7a2b", color: "white", border: "none", borderRadius: "4px", cursor: subiendo ? "not-allowed" : "pointer", fontWeight: "bold" }}>
            {subiendo ? "⏳ Subiendo..." : "💾 Guardar"}
          </button>
          <button type="button" onClick={() => router.push("/publicaciones")} style={{ padding: "0.7rem 1.5rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            ❌ Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}
