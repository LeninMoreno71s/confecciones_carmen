"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Link from "next/link";
import Carta from "../../components/carta_producto";
import CartaPublicacion from "../../components/carta_publicacion";

export default function HomePage() {
  const [selectedPub, setSelectedPub] = useState<any>(null);
  const [publicaciones, setPublicaciones] = useState<any[]>([]);

  useEffect(() => {
    // Intentamos cargar las publicaciones creadas por el admin desde el localStorage
    const pubGuardadas = localStorage.getItem("publicaciones");
    if (pubGuardadas && JSON.parse(pubGuardadas).length > 0) {
      setPublicaciones(JSON.parse(pubGuardadas));
    } else {
      // Si no hay ninguna publicación real todavía, mostramos estas de ejemplo
      const publicacionesMock = [
        {
          id: 1,
          imagen: "/oso_traje.webp",
          titulo: "Nueva Colección de Disfraces",
          fecha: "15/06/2026",
          descripcion: "Estamos emocionados de anunciar nuestra nueva colección de disfraces para esta temporada. Hemos trabajado duro para traer los mejores diseños y materiales. ¡Ven a verlos! Tendremos promociones especiales para los primeros compradores."
        },
        {
          id: 2,
          imagen: "/traje_caporal.jpg",
          titulo: "Taller de Costura Básica",
          fecha: "10/06/2026",
          descripcion: "El próximo mes abriremos un taller de costura básica para todos los interesados en aprender este hermoso arte. Las inscripciones ya están abiertas. No se requiere experiencia previa, solo ganas de aprender."
        }
      ];
      setPublicaciones(publicacionesMock);
    }
  }, []);

  return (
    <main>
      {/* HEADER CON NOMBRE DE USUARIO */}
      <Header />

      {/* HERO SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #F5F0E8 0%, #E8D5B7 50%, #D4C4A8 100%)",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
          paddingTop: "5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo centrado arriba */}
        <img
          src="/ConC alter version.png"
          alt="Logo Confecciones Carmen"
          style={{
            maxWidth: "600px",
            width: "100%",
            height: "auto",
            marginBottom: "1rem",
          }}
        />
        {/* Fondo decorativo */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(139, 58, 74, 0.1)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(43, 122, 43, 0.08)",
            zIndex: 0,
          }}
        />

        {/* Contenido del hero */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "999px",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🧵</span>
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#2b7a2b",
              }}
            >
              Desde Copiapó, con amor
            </span>
          </div>

          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              color: "#2b7a2b",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Confecciones{" "}
            <span style={{ color: "#8B3A4A" }}>Carmen</span>
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              color: "#495057",
              marginBottom: "2rem",
              lineHeight: 1.6,
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
            }}
          >
            Especialistas en confección de trajes, vestidos y arreglos. Calidad
            y dedicación en cada puntada.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="#productos"
              style={{
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
              }}
            >
              👗 Ver Productos
            </Link>

            {/* BOTÓN CREAR CUENTA */}
            <Link
              href="/registro"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2rem",
                background: "white",
                color: "#8B3A4A",
                border: "2px solid #8B3A4A",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
            >
              ✨ Crear Cuenta
            </Link>

            {/* BOTÓN INICIAR SESIÓN */}
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2rem",
                background: "white",
                color: "#2b7a2b",
                border: "2px solid #2b7a2b",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
            >
              🔐 Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            animation: "bounce 2s infinite",
          }}
        >
          <span style={{ fontSize: "1.5rem", opacity: 0.5 }}>↓</span>
        </div>
      </section>

      {/* SECCIÓN DE PRODUCTOS */}
      <section
        id="productos"
        style={{
          padding: "4rem 2rem",
          background: "white",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#d4edda",
                color: "#155724",
                padding: "0.4rem 1.2rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              ✨ Nuestro Catálogo
            </span>
            <h2
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "#212529",
                marginBottom: "0.5rem",
              }}
            >
              Productos Destacados
            </h2>
            <p style={{ color: "#6c757d", fontSize: "1rem" }}>
              Cada prenda es elaborada con dedicación y los mejores materiales
            </p>
          </div>

          {/* Grid de productos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            <Carta
              image="/oso_traje.webp"
              name="Traje Oso"
              descripcion="Traje completo de oso con detalles artesanales."
              costo={45000}
              stock={3}
            />
            <Carta
              image="/cabeza_oso.webp"
              name="Cabeza Oso"
              descripcion="Cabeza decorada con colores vibrantes."
              costo={20000}
              stock={5}
            />
            <Carta
              image="/saya-boy.webp"
              name="Saya Boy"
              descripcion="Vestimenta tradicional con cinturón rojo."
              costo={35000}
              stock={1}
            />
            <Carta
              image="/traje.webp"
              name="Traje"
              descripcion="Vestimenta Disfraz Jesús"
              costo={35000}
              stock={1}
            />
            <Carta
              image="/traje_caporal.jpg"
              name="Traje Caporal"
              descripcion="Vestimenta Caporal"
              costo={35000}
              stock={0}
            />
            <Carta
              image="/traje_niña.jpg"
              name="Traje Niña"
              descripcion="Vestimenta para niñas a la medida"
              costo={35000}
              stock={1}
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN DE SERVICIOS */}
      <section
        style={{
          padding: "4rem 2rem",
          background: "#f8f9fa",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "#fff3cd",
                color: "#856404",
                padding: "0.4rem 1.2rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              🛠️ Servicios
            </span>
            <h2
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "#212529",
                marginBottom: "0.5rem",
              }}
            >
              ¿Qué ofrecemos?
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👗</div>
              <h3 style={{ marginBottom: "0.5rem", color: "#212529" }}>
                Creación
              </h3>
              <p style={{ color: "#6c757d", fontSize: "0.95rem" }}>
                Confección de prendas desde cero con diseños únicos
              </p>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔧</div>
              <h3 style={{ marginBottom: "0.5rem", color: "#212529" }}>
                Modificaciones
              </h3>
              <p style={{ color: "#6c757d", fontSize: "0.95rem" }}>
                Ajustes y cambios para que tus prendas queden perfectas
              </p>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "2rem",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🪡</div>
              <h3 style={{ marginBottom: "0.5rem", color: "#212529" }}>
                Reparación
              </h3>
              <p style={{ color: "#6c757d", fontSize: "0.95rem" }}>
                Arreglos y composturas para dar nueva vida a tu ropa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE PUBLICACIONES */}
      <section style={{ padding: "4rem 2rem", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-block", background: "#e2e3e5", color: "#383d41", padding: "0.4rem 1.2rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
              📰 Novedades
            </span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#212529", marginBottom: "0.5rem" }}>
              Últimas Publicaciones
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {/* Renderizamos el componente reutilizable mapeando el estado de publicaciones reales */}
            {publicaciones.length > 0 ? (
              publicaciones.map((pub) => (
                <CartaPublicacion 
                  key={pub.id} 
                  pub={pub} 
                  onClick={() => setSelectedPub(pub)} 
                />
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#6c757d", gridColumn: "1 / -1" }}>
                No hay publicaciones disponibles en este momento.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* MODAL DE PUBLICACIÓN */}
      {selectedPub && (
        <div 
          onClick={() => setSelectedPub(null)}
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: "12px", maxWidth: "600px", width: "100%", overflow: "hidden", position: "relative", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
          >
            <button 
              onClick={() => setSelectedPub(null)}
              style={{ 
                position: "absolute", top: "15px", right: "15px", background: "#dc3545", color: "white", 
                border: "none", borderRadius: "50%", width: "36px", height: "36px", 
                cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold", zIndex: 10 
              }}
            >
              ✕
            </button>
            <img src={selectedPub.imagen} alt={selectedPub.titulo} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
            <div style={{ padding: "2rem" }}>
              <small style={{ color: "#6c757d", fontWeight: 600 }}>{selectedPub.fecha}</small>
              <h2 style={{ margin: "0.5rem 0", color: "#212529" }}>{selectedPub.titulo}</h2>
              <p style={{ color: "#495057", lineHeight: "1.6" }}>{selectedPub.descripcion}</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />

      {/* Animación de rebote */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}