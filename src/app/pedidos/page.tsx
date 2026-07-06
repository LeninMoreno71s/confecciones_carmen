"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { obtenerTodos, eliminarDocumento, actualizarDocumento } from "../../lib/firestore";

// Interfaz de producto dentro del pedido
interface ProductoPedido {
  id: number;
  name: string;
  cantidad: number;
  costo: number;
}

// Interfaz de pedido
interface Pedido {
  id: string;
  cliente: string;
  productos: ProductoPedido[];
  fecha: string;
  estado: string;
}

export default function PedidosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, cargandoAuth } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // Protección de admin + Carga de pedidos
  useEffect(() => {
    if (!cargandoAuth && (!estaAutenticado || usuario?.rol !== "admin")) {
      router.push("/login");
      return;
    }

    async function cargarPedidos() {
      setCargando(true);
      const resultado = await obtenerTodos("pedidos");
      if (resultado.exito) {
        setPedidos(resultado.datos);
      }
      setCargando(false);
    }

    if (estaAutenticado && usuario?.rol === "admin") {
      cargarPedidos();
    }
  }, [cargandoAuth, estaAutenticado, usuario, router]);

  // Cambiar estado del pedido
  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    const resultado = await actualizarDocumento("pedidos", id, { estado: nuevoEstado });
    if (resultado.exito) {
      setPedidos(pedidos.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
    }
  };

  // Eliminar pedido
  const eliminarPedido = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      const resultado = await eliminarDocumento("pedidos", id);
      if (resultado.exito) {
        setPedidos(pedidos.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el pedido");
      }
    }
  };

  // Calcular total de un pedido
  const calcularTotalPedido = (p: Pedido) => {
    if (!p.productos) return 0;
    return p.productos.reduce((acc, prod) => acc + prod.costo * prod.cantidad, 0);
  };

  // Buscar pedidos por cliente o producto
  const resultados = pedidos.filter(
    (p) =>
      p.cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.productos?.some((prod) =>
        prod.name?.toLowerCase().includes(busqueda.toLowerCase())
      )
  );

  // Colores por estado
  const colorEstado = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "pendiente": return "#ffc107";
      case "en preparación": return "#0d6efd";
      case "entregado": return "#198754";
      case "cancelado": return "#dc3545";
      default: return "#6c757d";
    }
  };

  // Loader
  if (cargandoAuth || cargando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "#6c757d" }}>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#fdfdfd" }}>
      <h1 style={{ color: "#800020", borderBottom: "3px solid #E6BE8A", paddingBottom: "0.5rem" }}>
        📋 Gestión de Pedidos
      </h1>

      {/* Estadísticas rápidas */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
        <div style={{ background: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: "120px", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2b7a2b" }}>{pedidos.length}</div>
          <small>Total Pedidos</small>
        </div>
        <div style={{ background: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: "120px", textAlign: "center", borderTop: "3px solid #ffc107" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#856404" }}>
            {pedidos.filter(p => p.estado?.toLowerCase() === "pendiente").length}
          </div>
          <small>Pendientes</small>
        </div>
        <div style={{ background: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: "120px", textAlign: "center", borderTop: "3px solid #198754" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#155724" }}>
            {pedidos.filter(p => p.estado?.toLowerCase() === "entregado").length}
          </div>
          <small>Entregados</small>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="🔍 Buscar por cliente o producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
          padding: "0.7rem 1rem",
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
          fontSize: "1rem",
          outline: "none",
        }}
        onFocus={(e) => e.target.style.borderColor = "#2b7a2b"}
        onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
      />

      {/* Listado de pedidos */}
      {resultados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6c757d" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <p>{busqueda ? "No se encontraron pedidos con ese criterio" : "No hay pedidos registrados"}</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}>
          {resultados.map((p) => (
            <div
              key={p.id}
              style={{
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "1.5rem",
                borderLeft: `4px solid ${colorEstado(p.estado)}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                <h3 style={{ color: "#800020", margin: 0 }}>
                  Pedido #{p.id?.substring(0, 8) || "N/A"}
                </h3>
                <select
                  value={p.estado || "pendiente"}
                  onChange={(e) => cambiarEstado(p.id, e.target.value)}
                  style={{
                    padding: "0.3rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en preparación">En preparación</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <p style={{ margin: "0.25rem 0" }}><strong>👤 Cliente:</strong> {p.cliente || "Sin nombre"}</p>
              <p style={{ margin: "0.25rem 0" }}><strong>📅 Fecha:</strong> {p.fecha || "Sin fecha"}</p>

              <div style={{ marginTop: "0.75rem" }}>
                <strong>🛍️ Productos:</strong>
                <ul style={{ marginTop: "0.25rem", paddingLeft: "1.2rem" }}>
                  {p.productos?.map((prod, index) => (
                    <li key={`${prod.id}-${index}`} style={{ fontSize: "0.9rem" }}>
                      {prod.name} — x{prod.cantidad} (${prod.costo?.toLocaleString("es-CL")} c/u)
                    </li>
                  )) || <li style={{ color: "#6c757d" }}>Sin productos</li>}
                </ul>
              </div>

              {/* Total */}
              <p style={{
                marginTop: "0.75rem",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#2b7a2b",
                textAlign: "right",
                borderTop: "1px solid #eee",
                paddingTop: "0.5rem",
              }}>
                Total: ${calcularTotalPedido(p).toLocaleString("es-CL")}
              </p>

              {/* Botón eliminar */}
              <button
                onClick={() => eliminarPedido(p.id)}
                style={{
                  marginTop: "0.8rem",
                  width: "100%",
                  padding: "0.5rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                🗑️ Eliminar Pedido
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botones para volver */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
          🏠 Ir a la Página Principal
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
          📊 Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
