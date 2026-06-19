"use client";
import React from "react";
import { CartaProducto } from "../types/productos"; // interfaz compartida

interface Props extends CartaProducto {
  onAddToCart: (producto: CartaProducto) => void;
}

const Carta: React.FC<Props> = ({
  id,
  image,
  name,
  descripcion,
  categoria,
  costo,
  stock,
  onAddToCart,
}) => {
  const defaultImage = "/oso_traje.webp";

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
          borderBottom: "3px solid #E6BE8A",
        }}
      />
      <div style={{ padding: "1rem" }}>
        <h3 style={{ color: "#800020", fontWeight: 700, fontSize: "1.2rem" }}>
          {name}
        </h3>
        {/* ✅ Mostrar categoría */}
        <p
          style={{
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: "#555",
            marginBottom: "0.5rem",
          }}
        >
          Categoría: {categoria}
        </p>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#3FA572",
            marginBottom: "0.5rem",
          }}
        >
          {descripcion}
        </p>
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#212529",
            marginBottom: "0.5rem",
          }}
        >
          ${costo}
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            color: stock > 0 ? "#2b7a2b" : "#800020",
          }}
        >
          {stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}
        </p>

        {stock > 0 && (
          <button
            style={{
              marginTop: "0.8rem",
              padding: "0.6rem 1.2rem",
              backgroundColor: "#3FA572",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "background-color 0.2s",
            }}
            onClick={() =>
              onAddToCart({
                id,
                image,
                name,
                descripcion,
                categoria,
                costo,
                stock,
              })
            }
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2b7a2b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#3FA572")
            }
          >
            🛒 Añadir al carrito
          </button>
        )}
      </div>
    </div>
  );
};

export default Carta;
