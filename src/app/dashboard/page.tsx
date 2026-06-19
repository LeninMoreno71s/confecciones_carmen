"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { estaAutenticado } = useAuth();

  useEffect(() => {
    // Protección estricta: Solo Admin
    const userGuardado = localStorage.getItem("usuario_actual");
    let esAdmin = false;
    if (userGuardado) {
      try {
        const u = JSON.parse(userGuardado);
        if (u.rol === "admin") esAdmin = true;
      } catch (e) {}
    }

    if (!esAdmin) {
      router.push("/login");
    }
  }, [router]);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊", active: true },
    { href: "/productos", label: "Productos", icon: "👗", active: false },
    { href: "/pedidos", label: "Pedidos", icon: "📦", active: false },
    { href: "/citas", label: "Citas", icon: "📅", active: false },
    { href: "/usuarios", label: "Usuarios", icon: "👥", active: false },
    { href: "/publicaciones", label: "Publicaciones", icon: "📰", active: false },
  ];

  const stats = [
    { label: "Productos", value: "24", icon: "👗", color: "#2b7a2b" },
    { label: "Pedidos Pendientes", value: "8", icon: "📦", color: "#C4A35A" },
    { label: "Citas Hoy", value: "5", icon: "📅", color: "#8B3A4A" },
    { label: "Usuarios", value: "12", icon: "👥", color: "#5B7B9A" },
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
                <Link
                  href={item.href}
                  className={item.active ? "active" : ""}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "1.5rem",
          right: "1.5rem"
        }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "0.9rem"
            }}
          >
            🚪 Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: "none",
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 200,
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem",
            cursor: "pointer",
            fontSize: "1.5rem"
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        {/* Top Bar */}
        <div className="top-bar">
          <h1>📊 Dashboard</h1>
          <div className="top-bar-user">
            <span style={{ fontSize: "0.9rem", color: "var(--gray-700)" }}>
              Admin
            </span>
            <div className="avatar">A</div>
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
                  <th>Producto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#001</td>
                  <td>María García</td>
                  <td>Traje de Oso Mistico</td>
                  <td>15/06/2026</td>
                  <td><span className="badge badge-warning">Pendiente</span></td>
                </tr>
                <tr>
                  <td>#002</td>
                  <td>Juan Pérez</td>
                  <td>Vestido para niña</td>
                  <td>14/06/2026</td>
                  <td><span className="badge badge-success">Completado</span></td>
                </tr>
                <tr>
                  <td>#003</td>
                  <td>Ana López</td>
                  <td>Modificaciones</td>
                  <td>13/06/2026</td>
                  <td><span className="badge badge-danger">Cancelado</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/productos" className="btn btn-primary">
            ➕ Añadir Producto
          </Link>
          <Link href="/pedidos" className="btn btn-secondary">
            📦 Nuevo Pedido
          </Link>
          <Link href="/citas" className="btn btn-outline">
            📅 Citas agendadas
          </Link>
          <Link href="/publicaciones/nuevo" className="btn btn-outline">
            📝 Nueva Publicación
          </Link>
        </div>
      </main>

      {/* Estilos para botón móvil */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}