"use client";
import { useEffect, useState } from "react";
import Carta from "../../../components/carta_producto";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { CartaProducto } from "../../../types/productos";
import Link from "next/link";

export default function ProductosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado } = useAuth();
  const [productos, setProductos] = useState<CartaProducto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [nuevo, setNuevo] = useState<CartaProducto>({
    id: 0,
    image: "",
    name: "",
    descripcion: "",
    costo: 0,
    stock: 0,
  });

  // ✅ Cartas iniciales definidas en código
  const productosIniciales: CartaProducto[] = [
    {
      id: 1,
      image: "/oso_traje.webp",
      name: "Traje Oso",
      descripcion: "Traje completo de oso con detalles artesanales.",
      costo: 45000,
      stock: 3,
    },
    {
      id: 2,
      image: "/cabeza_oso.webp",
      name: "Cabeza Oso",
      descripcion: "Cabeza decorada con colores vibrantes.",
      costo: 20000,
      stock: 5,
    },
    {
      id: 3,
      image: "/saya-boy.webp",
      name: "Saya Boy",
      descripcion: "Vestimenta tradicional con cinturón rojo.",
      costo: 35000,
      stock: 1,
    },
    {
      id: 4,
      image: "/traje.webp",
      name: "Traje",
      descripcion: "Vestimenta Disfraz Jesús",
      costo: 35000,
      stock: 1,
    },
    {
      id: 5,
      image: "/traje_caporal.jpg",
      name: "Traje Caporal",
      descripcion: "Vestimenta Caporal",
      costo: 35000,
      stock: 0,
    },
    {
      id: 6,
      image: "/traje_niña.jpg",
      name: "Traje Niña",
      descripcion: "Vestimenta para niñas a la medida",
      costo: 35000,
      stock: 1,
    },
  ];

  useEffect(() => {
    const userGuardado = localStorage.getItem("usuario_actual");
    if (!estaAutenticado && !userGuardado) {
      router.push("/login");
      return;
    }

    const data = localStorage.getItem("productos");
    if (data) {
      setProductos(JSON.parse(data));
    } else {
      // ✅ Si no hay productos en localStorage, cargar los iniciales
      setProductos(productosIniciales);
      localStorage.setItem("productos", JSON.stringify(productosIniciales));
    }
  }, [estaAutenticado, router]);

  const guardarProductos = (lista: CartaProducto[]) => {
    setProductos(lista);
    localStorage.setItem("productos", JSON.stringify(lista));
  };

  const crearProducto = () => {
    const ultimoId =
      productos.length > 0 ? Math.max(...productos.map((p) => p.id)) : 0;
    const nuevoProducto = { ...nuevo, id: ultimoId + 1 };
    guardarProductos([...productos, nuevoProducto]);
    setNuevo({ id: 0, image: "", name: "", descripcion: "", costo: 0, stock: 0 });
  };

  const eliminarProducto = (id: number) => {
    guardarProductos(productos.filter((p) => p.id !== id));
  };

  const modificarProducto = (id: number, cambios: Partial<CartaProducto>) => {
    guardarProductos(productos.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
  };

  const resultados = productos.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );



  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ color: "#800020", marginBottom: "1.5rem" }}>👗 Panel de Productos</h1>

      {/* Botones de navegación */}
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/">
          <button style={{ padding: "0.6rem 1.2rem", backgroundColor: "#3FA572", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
            🏠 Ir a la Página Principal
          </button>
        </Link>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ padding: "0.6rem 1.2rem", backgroundColor: "#3FA572", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
        >
          ⬅️ Volver al Panel Admin
        </button>
      </div>

      {/* Formulario para crear carta */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#3FA572" }}>➕ Añadir nuevo producto</h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <input type="text" placeholder="Imagen (ruta)" value={nuevo.image}
            onChange={(e) => setNuevo({ ...nuevo, image: e.target.value })}
            style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="Nombre" value={nuevo.name}
            onChange={(e) => setNuevo({ ...nuevo, name: e.target.value })}
            style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="Descripción" value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" }} />
          <input type="number" placeholder="Costo" value={nuevo.costo}
            onChange={(e) => setNuevo({ ...nuevo, costo: Number(e.target.value) })}
            style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" }} />
          <input type="number" placeholder="Stock" value={nuevo.stock}
            onChange={(e) => setNuevo({ ...nuevo, stock: Number(e.target.value) })}
            style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" }} />
        </div>
        <button
          onClick={crearProducto}
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
          ➕ Añadir Carta
        </button>
      </div>

      {/* Buscar carta */}
      <input
        type="text"
        placeholder="🔍 Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          marginBottom: "1.5rem",
          padding: "0.6rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "400px",
        }}
      />


      {/* Mostrar cartas */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
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
        transition: "transform 0.2s",
      }}
    >
      <Carta
        id={p.id}
        image={p.image}
        name={p.name}
        descripcion={p.descripcion}
        costo={p.costo}
        stock={p.stock}
        onAddToCart={() => {
          const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
          carrito.push({ ...p, cantidad: 1 });
          localStorage.setItem("carrito", JSON.stringify(carrito));
          alert(`${p.name} añadido al carrito`);
        }}
      />
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => eliminarProducto(p.id)}
          style={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          🗑️ Eliminar
        </button>
        <button
          onClick={() => modificarProducto(p.id, { stock: p.stock - 1 })}
          disabled={p.stock <= 0}
          style={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ➖ Stock
        </button>
        <button
          onClick={() => modificarProducto(p.id, { stock: p.stock + 1 })}
          style={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: "#FFD700",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ➕ Stock
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}
