"use client";
import { useEffect, useState } from "react";
import Carta from "../../../components/carta_producto";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { CartaProducto } from "../../../types/productos";
import Link from "next/link";

export default function ProductosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado } = useAuth(); // ✅ ahora sí extraemos usuario
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

  // Cargar al iniciar
  useEffect(() => {
    const userGuardado = localStorage.getItem("usuario_actual");
    if (!estaAutenticado && !userGuardado) {
      router.push("/login");
      return;
    }

    const data = localStorage.getItem("productos");
    if (data) {
      setProductos(JSON.parse(data));
    }
  }, [estaAutenticado, router]);

  // Guardar cambios
  const guardarProductos = (lista: CartaProducto[]) => {
    setProductos(lista);
    localStorage.setItem("productos", JSON.stringify(lista));
  };

  // Crear con id incremental
  const crearProducto = () => {
    const ultimoId =
      productos.length > 0 ? Math.max(...productos.map((p) => p.id)) : 0;
    const nuevoProducto = { ...nuevo, id: ultimoId + 1 };
    guardarProductos([...productos, nuevoProducto]);
    setNuevo({
      id: 0,
      image: "",
      name: "",
      descripcion: "",
      costo: 0,
      stock: 0,
    });
  };

  // Eliminar
  const eliminarProducto = (id: number) => {
    guardarProductos(productos.filter((p) => p.id !== id));
  };

  // Modificar
  const modificarProducto = (id: number, cambios: Partial<CartaProducto>) => {
    guardarProductos(
      productos.map((p) => (p.id === id ? { ...p, ...cambios } : p))
    );
  };

  // Buscar
  const resultados = productos.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>👗 Administración de Cartas</h1>

      {/* Botón para ir al carrito */}
      <Link href="/carrito">
        <button
          style={{
            marginBottom: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#800020",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          🛒 Ir al carrito
        </button>
      </Link>

      {/* Formulario para crear carta */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Imagen (ruta)"
          value={nuevo.image}
          onChange={(e) => setNuevo({ ...nuevo, image: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.name}
          onChange={(e) => setNuevo({ ...nuevo, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
        />
        <input
          type="number"
          placeholder="Costo"
          value={nuevo.costo}
          onChange={(e) => setNuevo({ ...nuevo, costo: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={nuevo.stock}
          onChange={(e) => setNuevo({ ...nuevo, stock: Number(e.target.value) })}
        />
        <button onClick={crearProducto}>➕ Añadir Carta</button>
      </div>

      {/* Buscar carta */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />

      {/* Mostrar cartas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {resultados.map((p) => (
          <div key={p.id}>
            <Carta
              id={p.id}
              image={p.image}
              name={p.name}
              descripcion={p.descripcion}
              costo={p.costo}
              stock={p.stock}
              onAddToCart={() => {
                // Aquí puedes implementar la lógica de añadir al carrito
                const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
                carrito.push({ ...p, cantidad: 1 });
                localStorage.setItem("carrito", JSON.stringify(carrito));
                alert(`${p.name} añadido al carrito`);
              }}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={() => eliminarProducto(p.id)}>🗑️ Eliminar</button>
              <button
                onClick={() => modificarProducto(p.id, { stock: p.stock + 1 })}
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
