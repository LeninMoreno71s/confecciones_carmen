"use client";
import Footer from "../../components/footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
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
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Aquí irán las tarjetas de productos */}
            
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
            {/* Tarjeta de servicio */}
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

            {/* Tarjeta de servicio */}
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

            {/* Tarjeta de servicio */}
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