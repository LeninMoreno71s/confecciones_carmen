"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { usuario, estaAutenticado, cerrarSesion, cargandoAuth } = useAuth();
  const router = useRouter();

  const [productos, setProductos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [citas, setCitas] = useState<any[]>([]);

  // Protección de acceso solo para admin
  useEffect(() => {
    if (!cargandoAuth && (!estaAutenticado || usuario?.rol !== "admin")) {
      router.push("/login");
    }

    const prodData = localStorage.getItem("productos");
    const pedData = localStorage.getItem("pedidos");
    const citasData = localStorage.getItem("citas");

    if (prodData) setProductos(JSON.parse(prodData));
    if (pedData) setPedidos(JSON.parse(pedData));
    if (citasData) setCitas(JSON.parse(citasData));
  }, [estaAutenticado, usuario, router, cargandoAuth]);

  // Estadísticas dinámicas
  const stats = [
    { label: "Productos", value: productos.length, icon: "👗", color: "#2b7a2b" },
    { label: "Pedidos Pendientes", value: pedidos.filter(p => p.estado === "Pendiente").length, icon: "📦", color: "#C4A35A" },
    { label: "Citas Hoy", value: citas.filter(c => new Date(c.fecha).toDateString() === new Date().toDateString()).length, icon: "📅", color: "#8B3A4A" },
  ];

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊", active: true },
    { href: "/productos", label: "Productos", icon: "👗", active: false },
    { href: "/pedidos", label: "Pedidos", icon: "📦", active: false },
    { href: "/citas", label: "Citas", icon: "📅", active: false },
    { href: "/publicaciones", label: "Publicaciones", icon: "📰", active: false },
  ];

  return (
    <div className="intranet-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <span style={{ fontSize: "2rem" }}>🧵</span>
          <div>
            <h2>Confecciones</h2>
            <span>Carmen</span>
          </div>
        </div>

        <nav>
          <ul className="sidebar-nav">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={item.active ? "active" : ""}>
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón de cerrar sesión */}
        <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem" }}>
          <button
            onClick={() => {
              cerrarSesion();
              router.push("/login");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem",
              color: "rgba(255,255,255,0.9)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
              width: "100%",
              justifyContent: "center",
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h1>📊 Dashboard</h1>
          <div className="top-bar-user">
            <span style={{ fontSize: "0.9rem", color: "var(--gray-700)" }}>
              {usuario?.nombre} {usuario?.apellido} ({usuario?.rol})
            </span>
            <div className="avatar">{usuario?.nombre?.charAt(0) || "A"}</div>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabla de pedidos recientes */}
        <div className="card">
          <div className="card-title">📦 Pedidos Recientes</div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(-5).map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.cliente}</td>
                    <td>
                      {p.productos.map((prod: any) => `${prod.name} x${prod.cantidad}`).join(", ")}
                    </td>
                    <td>{p.fecha}</td>
                    <td>
                      <span className={`badge ${p.estado === "Pendiente" ? "badge-warning" : "badge-success"}`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/productos" className="btn btn-primary">➕ Añadir Producto</Link>
          <Link href="/pedidos" className="btn btn-secondary">📦 Nuevo Pedido</Link>
          <Link href="/citas" className="btn btn-outline">📅 Citas agendadas</Link>
          <Link href="/publicaciones/nuevo" className="btn btn-outline">📝 Nueva Publicación</Link>
          <Link href="/" className="btn btn-success">🏠 Ir a la Página Principal</Link>
        </div>
      </main>
    </div>
  );
}
