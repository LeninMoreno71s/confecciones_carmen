"use client";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #1e5e1e, #2b7a2b)",
        color: "white",
        padding: "3rem 2rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🧵</div>
        <h3 style={{ marginBottom: "0.5rem" }}>Confecciones Carmen</h3>
        <p style={{ opacity: 0.8, marginBottom: "1.5rem" }}>
          Copiapó, Región de Atacama, Chile
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <span>📞 +56 9 6196 8245</span>
          <span>✉️ carmenburgos1076@gmail.com</span>
          <span>📍 Copiapó</span>
        </div>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            marginBottom: "1rem",
          }}
        />
        <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
          © 2026 Confecciones Carmen. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
