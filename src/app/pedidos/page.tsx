"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Interfaz de producto dentro del pedido
interface ProductoPedido {
  id: number;
  name: string;
  cantidad: number;
  costo: number; // ✅ ahora incluye costo
}

// Interfaz de pedido
interface Pedido {
  id: number;
  cliente: string;
  productos: ProductoPedido[];
  fecha: string;
  estado: string;
}

export default function PedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar pedidos desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("pedidos");
    if (data) setPedidos(JSON.parse(data));
  }, []);

  // Guardar cambios en localStorage
  const guardarPedidos = (lista: Pedido[]) => {
    setPedidos(lista);
    localStorage.setItem("pedidos", JSON.stringify(lista));
  };

  // Eliminar pedido
  const eliminarPedido = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      guardarPedidos(pedidos.filter((p) => p.id !== id));
    }
  };

  // Calcular total de un pedido
  const calcularTotalPedido = (p: Pedido) => {
    return p.productos.reduce((acc, prod) => acc + prod.costo * prod.cantidad, 0);
  };

  // Buscar pedidos por cliente o producto
  const resultados = pedidos.filter(
    (p) =>
      p.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.productos.some((prod) =>
        prod.name.toLowerCase().includes(busqueda.toLowerCase())
      )
  );

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#fdfdfd" }}>
      <h1 style={{ color: "#800020", borderBottom: "3px solid #E6BE8A", paddingBottom: "0.5rem" }}>
        📋 Gestión de Pedidos
      </h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por cliente o producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          marginTop: "1rem",
          marginBottom: "1.5rem",
          padding: "0.5rem",
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      />

      {/* Listado de pedidos */}
      {resultados.length === 0 ? (
        <p style={{ color: "#555" }}>No se encontraron pedidos.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {resultados.map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "1rem",
              }}
            >
              <h3 style={{ color: "#800020" }}>Pedido #{p.id}</h3>
              <p><strong>Cliente:</strong> {p.cliente}</p>
              <p><strong>Fecha:</strong> {p.fecha}</p>
              <p><strong>Estado:</strong> {p.estado}</p>

              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {p.productos.map((prod, index) => (
                  <li key={`${prod.id}-${index}`}>
                    {prod.name} — x{prod.cantidad} (${prod.costo} c/u)
                  </li>
                ))}
              </ul>

              {/* ✅ Mostrar total */}
              <p style={{ marginTop: "0.5rem", fontWeight: 700, color: "#800020" }}>
                Total a pagar: ${calcularTotalPedido(p)}
              </p>

              <button
                onClick={() => eliminarPedido(p.id)}
                style={{
                  marginTop: "0.8rem",
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#800020",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botones para volver */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3FA572",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ⬅️ Volver a la página principal
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#3FA572",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ⬅️ Volver al Panel Admin
        </button>
      </div>
    </div>
  );
}
