"use client";
import React from "react";

interface CartaProducto {
  image: string;
  name: string;
  descripcion: string;
  costo: number;
  stock: number;
}

const Carta: React.FC<CartaProducto> = ({ image, name, descripcion, costo, stock }) => {
    const defaultImage = "/oso_traje.webp"; // ruta de tu imagen por defecto
    return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
      }}
    >
      <img
        src={image || defaultImage}
        alt={name}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "contain",
          borderBottom: "3px solid #E6BE8A", // dorado pálido
        }}
      />
      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            margin: "0 0 0.5rem 0",
            color: "#800020", // vino
            fontWeight: 700,
            fontSize: "1.2rem",
          }}
        >
          {name}
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#3FA572", marginBottom: "0.5rem" }}>
          {descripcion}
        </p>
        <p style={{ fontSize: "1rem", fontWeight: 600, color: "#212529", marginBottom: "0.5rem" }}>
           ${costo}
        </p>
        <p style={{ fontSize: "0.85rem", color: stock > 0 ? "#2b7a2b" : "#800020" }}>
          {stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}
        </p>
      </div>
    </div>
  );
};

export default Carta;

