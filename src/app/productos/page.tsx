"use client";
import { useEffect, useState } from "react";
import Carta from "../../../components/carta_producto"; // tu componente
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface CartaProducto {
  id: number;
  image: string;
  name: string;
  descripcion: string;
  costo: number;
  stock: number;
}

export default function ProductosPage() {
  const router = useRouter();
  const { estaAutenticado } = useAuth();
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
    // Protección básica de ruta
    const userGuardado = localStorage.getItem("usuario_actual");
    if (!estaAutenticado && !userGuardado) {
      router.push("/login");
      return;
    }

    const data = localStorage.getItem("productos");
    if (data) {
      setProductos(JSON.parse(data));
    }
  }, []);

  // Guardar cambios
  const guardarProductos = (lista: CartaProducto[]) => {
    setProductos(lista);
    localStorage.setItem("productos", JSON.stringify(lista));
  };

  // Crear
  const crearProducto = () => {
    const nuevoProducto = { ...nuevo, id: Date.now() };
    guardarProductos([...productos, nuevoProducto]);
    setNuevo({ id: 0, image: "", name: "", descripcion: "", costo: 0, stock: 0 });
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
              image={p.image}
              name={p.name}
              descripcion={p.descripcion}
              costo={p.costo}
              stock={p.stock}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={() => eliminarProducto(p.id)}>🗑️ Eliminar</button>
              <button onClick={() => modificarProducto(p.id, { stock: p.stock + 1 })}>
                ➕ Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
