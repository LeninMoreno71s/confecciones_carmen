"use client";
import { useEffect, useState } from "react";
import Carta from "../../../components/carta_producto";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { CartaProducto } from "../../../types/productos";
import Link from "next/link";
import { obtenerTodos, agregarDocumento, eliminarDocumento, actualizarDocumento } from "../../lib/firestore";

export default function ProductosPage() {
  const router = useRouter();
  const { usuario, estaAutenticado, cargandoAuth } = useAuth();
  const [productos, setProductos] = useState<CartaProducto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [nuevo, setNuevo] = useState<CartaProducto>({
    id: 0,
    image: "",
    name: "",
    descripcion: "",
    categoria: "",
    costo: 0,
    stock: 0,
  });

  // Productos iniciales (solo si Firestore está vacío)
  const productosIniciales: CartaProducto[] = [
    { id: 1, image: "/oso_traje.webp", name: "Traje Oso", descripcion: "Traje completo de oso con detalles artesanales.", categoria: "Trajes", costo: 45000, stock: 3 },
    { id: 2, image: "/cabeza_oso.webp", name: "Cabeza Oso", descripcion: "Cabeza decorada con colores vibrantes.", categoria: "Accesorios", costo: 20000, stock: 5 },
    { id: 3, image: "/saya-boy.webp", name: "Saya Boy", descripcion: "Vestimenta tradicional con cinturón rojo.", categoria: "Trajes", costo: 35000, stock: 1 },
    { id: 4, image: "/traje.webp", name: "Traje", descripcion: "Vestimenta Disfraz Jesús", categoria: "Trajes", costo: 35000, stock: 1 },
    { id: 5, image: "/traje_caporal.jpg", name: "Traje Caporal", descripcion: "Vestimenta Caporal", categoria: "Trajes", costo: 35000, stock: 0 },
    { id: 6, image: "/traje_niña.jpg", name: "Traje Niña", descripcion: "Vestimenta para niñas a la medida", categoria: "Trajes", costo: 35000, stock: 1 },
  ];

  // Cargar productos de Firestore
  useEffect(() => {
    if (!cargandoAuth && (!estaAutenticado || usuario?.rol !== "admin")) {
      router.push("/login");
      return;
    }

    async function cargarProductos() {
      setCargando(true);
      const resultado = await obtenerTodos("productos");
      
      if (resultado.exito && resultado.datos.length > 0) {
        setProductos(resultado.datos);
      } else {
        setProductos(productosIniciales);
        for (const prod of productosIniciales) {
          await agregarDocumento("productos", prod);
        }
      }
      setCargando(false);
    }

    if (estaAutenticado && usuario?.rol === "admin") {
      cargarProductos();
    }
  }, [estaAutenticado, usuario, router, cargandoAuth]);

  // Crear producto (Firestore con subida de imagen local)
  const crearProducto = async () => {
    if (!nuevo.name || !nuevo.categoria) {
      alert("Por favor ingresa al menos el nombre y la categoría del producto");
      return;
    }

    setSubiendo(true);
    let rutaImagen = nuevo.image || "/oso_traje.webp";

    if (archivo) {
      const formData = new FormData();
      formData.append("file", archivo);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const dataUpload = await res.json();

        if (dataUpload.success) {
          rutaImagen = dataUpload.url;
        } else {
          alert(dataUpload.error || "Error al subir la imagen");
          setSubiendo(false);
          return;
        }
      } catch (error) {
        console.error("Error de conexión al subir la imagen:", error);
        alert("Error de conexión al subir la imagen");
        setSubiendo(false);
        return;
      }
    }

    const resultado = await agregarDocumento("productos", {
      name: nuevo.name,
      descripcion: nuevo.descripcion,
      categoria: nuevo.categoria,
      costo: Number(nuevo.costo),
      stock: Number(nuevo.stock),
      image: rutaImagen,
    });

    if (resultado.exito) {
      setProductos([...productos, { ...nuevo, image: rutaImagen, id: resultado.id } as any]);
      setNuevo({ id: 0, image: "", name: "", descripcion: "", categoria: "", costo: 0, stock: 0 });
      setArchivo(null);
      const inputSelector = document.getElementById("selector-imagen-producto") as HTMLInputElement;
      if (inputSelector) inputSelector.value = "";
    } else {
      alert("Error al crear el producto");
    }
    setSubiendo(false);
  };

  // Eliminar producto (Firestore)
  const eliminarProducto = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      const resultado = await eliminarDocumento("productos", id);
      if (resultado.exito) {
        setProductos(productos.filter((p) => String(p.id) !== id));
      } else {
        alert("Error al eliminar el producto");
      }
    }
  };

  // Modificar stock (Firestore)
  const modificarProducto = async (id: string, cambios: Partial<CartaProducto>) => {
    const resultado = await actualizarDocumento("productos", id, cambios);
    if (resultado.exito) {
      setProductos(productos.map((p) => (String(p.id) === id ? { ...p, ...cambios } : p)));
    }
  };

  const resultados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargandoAuth || cargando) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>⏳ Cargando productos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ color: "#800020", marginBottom: "1.5rem" }}>👗 Panel de Productos</h1>

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

      {/* Formulario para crear producto */}
      <div style={{
        background: "white", padding: "1.5rem", borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginBottom: "2rem",
      }}>
        <h2 style={{ marginBottom: "1rem", color: "#3FA572" }}>➕ Añadir nuevo producto</h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3FA572" }}>📷 Imagen del Producto:</label>
            <input
              id="selector-imagen-producto"
              type="file"
              accept="image/*"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              style={{ padding: "0.5rem", borderRadius: "8px", border: "1px dashed #3FA572", background: "#f0f8f0", fontSize: "0.85rem" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3FA572" }}>Nombre:</label>
            <input type="text" placeholder="Nombre" value={nuevo.name}
              onChange={(e) => setNuevo({ ...nuevo, name: e.target.value })}
              style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3FA572" }}>Descripción:</label>
            <input type="text" placeholder="Descripción" value={nuevo.descripcion}
              onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
              style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3FA572" }}>Categoría:</label>
            <input type="text" placeholder="Categoría" value={nuevo.categoria}
              onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
              style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }} />
          </div>

          {/* ETIQUETA AÑADIDA AL COSTO/PRECIO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3FA572" }}> Precio ($):</label>
            <input type="number" placeholder="Costo" value={nuevo.costo}
              onChange={(e) => setNuevo({ ...nuevo, costo: Number(e.target.value) })}
              style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }} />
          </div>

          {/* ETIQUETA AÑADIDA AL STOCK */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3FA572" }}>📦 Stock Disponible:</label>
            <input type="number" placeholder="Stock" value={nuevo.stock}
              onChange={(e) => setNuevo({ ...nuevo, stock: Number(e.target.value) })}
              style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%" }} />
          </div>

        </div>
        <button onClick={crearProducto} disabled={subiendo} style={{
          marginTop: "1rem", padding: "0.6rem 1.2rem", backgroundColor: subiendo ? "#6c757d" : "#3FA572",
          color: "white", border: "none", borderRadius: "8px", cursor: subiendo ? "not-allowed" : "pointer", fontWeight: 600,
        }}>
          {subiendo ? "⏳ Subiendo imagen y guardando..." : "➕ Añadir Producto"}
        </button>
      </div>

      <input type="text" placeholder="🔍 Buscar por nombre o categoría..." value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: "1.5rem", padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc", width: "100%", maxWidth: "400px" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
        {resultados.map((p) => (
          <div key={p.id} style={{
            background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "1rem", transition: "transform 0.2s",
          }}>
            <Carta
              id={Number(p.id) || 0}
              image={p.image}
              name={p.name}
              descripcion={p.descripcion}
              categoria={p.categoria}
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
              <button onClick={() => eliminarProducto(String(p.id))} style={{
                flex: 1, padding: "0.5rem", backgroundColor: "#dc3545", color: "white",
                border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600,
              }}>
                🗑️ Eliminar
              </button>
              <button onClick={() => modificarProducto(String(p.id), { stock: p.stock - 1 })}
                disabled={p.stock <= 0} style={{
                  flex: 1, padding: "0.5rem", backgroundColor: "#dc3545", color: "white",
                  border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600,
                }}>
                ➖ Stock
              </button>
              <button onClick={() => modificarProducto(String(p.id), { stock: p.stock + 1 })} style={{
                flex: 1, padding: "0.5rem", backgroundColor: "#FFD700", color: "#000",
                border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600,
              }}>
                ➕ Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}