"use client";
import { useEffect, useState } from "react";
import { ItemCarrito } from "../../../types/productos";
import Link from "next/link";

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  const actualizarCarrito = (nuevoCarrito: ItemCarrito[]) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const aumentarCantidad = (id: number) => {
    const actualizado = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    actualizarCarrito(actualizado);
  };

  const reducirCantidad = (id: number) => {
    const actualizado = carrito
      .map((item) =>
        item.id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      .filter((item) => item.cantidad > 0); // elimina si llega a 0
    actualizarCarrito(actualizado);
  };

  const calcularTotal = () =>
    carrito.reduce((acc, item) => acc + item.costo * item.cantidad, 0);

  const finalizarCompra = () => {
  if (carrito.length === 0) return;

  const usuarioActual = JSON.parse(localStorage.getItem("usuario_actual") || "{}");

  const nuevoPedido = {
    id: Date.now(),
    cliente: `${usuarioActual.nombre} ${usuarioActual.apellido}` || usuarioActual.correo || "Invitado",
    productos: carrito.map((item) => ({
      nombre: item.name,
      cantidad: item.cantidad,
    })),
    fecha: new Date().toLocaleString(),
    estado: "Pendiente",
  };

  const data = localStorage.getItem("pedidos");
  const pedidos = data ? JSON.parse(data) : [];
  pedidos.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  localStorage.removeItem("carrito");
  setCarrito([]);

  alert("✅ Compra finalizada. El pedido fue generado.");
  };


  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#fdfdfd",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#800020",
          borderBottom: "3px solid #E6BE8A",
          paddingBottom: "0.5rem",
        }}
      >
        🛒 Carrito de Compras
      </h1>

      {carrito.length === 0 ? (
        <p style={{ marginTop: "2rem", color: "#555" }}>
          No hay productos en el carrito.
        </p>
      ) : (
        carrito.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ color: "#800020" }}>{item.name}</h3>
            <p>Cantidad: {item.cantidad}</p>
            <p>Precio unitario: ${item.costo}</p>
            <p>Total: ${item.costo * item.cantidad}</p>

            {/* Botones de cantidad */}
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => reducirCantidad(item.id)}
                style={{
                  marginRight: "0.5rem",
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#800020",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ➖
              </button>
              <button
                onClick={() => aumentarCantidad(item.id)}
                style={{
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#3FA572",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ➕
              </button>
            </div>
          </div>
        ))
      )}

      {/* Total general */}
      {carrito.length > 0 && (
        <>
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "#E6BE8A",
              borderRadius: "8px",
              textAlign: "right",
              fontWeight: 700,
              color: "#800020",
            }}
          >
            Total a pagar: ${calcularTotal()}
          </div>
          {/* JSX del botón de compra */}
          <button
            onClick={finalizarCompra}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.2rem",
              backgroundColor: "#3FA572",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ✅ Finalizar compra
          </button>
        </>
      )}

      {/* Botón para volver a la página principal */}
      <Link href="/">
        <button
          style={{
            marginTop: "2rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#800020",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ⬅️ Volver a la página principal
        </button>
      </Link>
    </div>
  );
}
