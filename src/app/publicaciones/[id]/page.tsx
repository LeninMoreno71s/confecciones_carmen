"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { agregarDocumento, actualizarDocumento, obtenerDocumento } from "../../../lib/firestore";

export interface Publicacion {
  id?: string;
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
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Protección estricta: Solo Admin
    if (!cargandoAuth && (!estaAutenticado || usuario?.rol !== "admin")) {
      router.push("/login");
      return;
    }

    // Si no es "nuevo", cargar datos de FIRESTORE para editar
    async function cargarPublicacion() {
      if (id !== "nuevo" && typeof id === "string") {
        setCargando(true);
        const resultado = await obtenerDocumento("publicaciones", id);
        if (resultado.exito && resultado.datos) {
          setPublicacion({
            titulo: resultado.datos.titulo || "",
            imagen: resultado.datos.imagen || "",
            contenido: resultado.datos.contenido || "",
          });
        }
        setCargando(false);
      }
    }

    if (estaAutenticado && usuario?.rol === "admin") {
      cargarPublicacion();
    }
  }, [id, router, cargandoAuth, estaAutenticado, usuario]);

  const guardar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    
    if (!publicacion.titulo || !publicacion.contenido || (id === "nuevo" && !archivo && !publicacion.imagen)) {
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

    try {
      if (id === "nuevo") {
        // ✅ CREAR en Firestore
        const nuevaPublicacion = {
          titulo: publicacion.titulo || "",
          imagen: rutaImagen,
          contenido: publicacion.contenido || "",
          fechaCreacion: new Date().toLocaleDateString("es-CL"),
          autorId: usuario?.id || "admin",
        };

        const resultado = await agregarDocumento("publicaciones", nuevaPublicacion);
        if (resultado.exito) {
          setSubiendo(false);
          alert("Publicación creada exitosamente");
          router.push("/publicaciones");
        } else {
          setError("Error al crear la publicación");
          setSubiendo(false);
        }
      } else {
        // ✅ EDITAR en Firestore
        const datosActualizados = {
          titulo: publicacion.titulo || "",
          imagen: rutaImagen,
          contenido: publicacion.contenido || "",
        };

        const resultado = await actualizarDocumento("publicaciones", id as string, datosActualizados);
        if (resultado.exito) {
          setSubiendo(false);
          alert("Publicación actualizada exitosamente");
          router.push("/publicaciones");
        } else {
          setError("Error al actualizar la publicación");
          setSubiendo(false);
        }
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Error al guardar la publicación");
      setSubiendo(false);
    }
  };

  // Mostrar loader mientras carga
  if (cargando) {
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
          <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>Cargando publicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: "600px", 
      margin: "0 auto",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F5F0E8 0%, #E8D5B7 100%)"
    }}>
      <h1 style={{ marginBottom: "1rem", color: "#2b7a2b" }}>
        {id === "nuevo" ? "📝 Crear Nueva Publicación" : "✏️ Editar Publicación"}
      </h1>

      {error && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: "0.75rem", borderRadius: "4px", marginBottom: "1rem" }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={guardar} style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "1.2rem", 
        background: "white", 
        padding: "2rem", 
        borderRadius: "8px", 
        border: "1px solid #dee2e6",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
      }}>
        
        {/* Título */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
            Título *
          </label>
          <input 
            type="text" 
            value={publicacion.titulo} 
            onChange={e => setPublicacion({...publicacion, titulo: e.target.value})}
            placeholder="Ej: Ofertas de Primavera"
            style={{ 
              width: "100%", 
              padding: "0.7rem", 
              border: "2px solid #e0e0e0", 
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#2b7a2b"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>
        
        {/* Imagen */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
            Imagen de Portada *
          </label>
          {publicacion.imagen && (
            <div style={{ marginBottom: "0.5rem" }}>
              <img 
                src={publicacion.imagen} 
                alt="Vista previa" 
                style={{ maxWidth: "200px", borderRadius: "4px" }} 
              />
              <p style={{ fontSize: "0.8rem", color: "#666" }}>
                Actual: {publicacion.imagen}
              </p>
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
            style={{ 
              width: "100%", 
              padding: "0.5rem", 
              border: "1px solid #ccc", 
              borderRadius: "4px" 
            }}
          />
        </div>

        {/* Contenido */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>
            Contenido *
          </label>
          <textarea 
            value={publicacion.contenido} 
            onChange={e => setPublicacion({...publicacion, contenido: e.target.value})}
            placeholder="Escribe la noticia o publicación aquí..."
            style={{ 
              width: "100%", 
              padding: "0.7rem", 
              minHeight: "150px", 
              border: "2px solid #e0e0e0", 
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            onFocus={(e) => e.target.style.borderColor = "#2b7a2b"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button 
            type="submit" 
            disabled={subiendo} 
            style={{ 
              padding: "0.7rem 1.5rem", 
              background: subiendo ? "#6c757d" : "#2b7a2b", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: subiendo ? "not-allowed" : "pointer", 
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "background 0.2s"
            }}
          >
            {subiendo ? "⏳ Subiendo..." : "💾 Guardar"}
          </button>
          <button 
            type="button" 
            onClick={() => router.push("/publicaciones")} 
            style={{ 
              padding: "0.7rem 1.5rem", 
              background: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer", 
              fontWeight: "bold",
              fontSize: "1rem"
            }}
          >
            ❌ Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}