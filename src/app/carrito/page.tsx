"use client";
import { useEffect, useState } from "react";
import { ItemCarrito } from "../../../types/productos";
import Link from "next/link";
import { db } from "../../lib/firebase"; // Ajusta esta ruta según tu configuración de Firebase
// Añadimos las funciones nativas necesarias para buscar y actualizar productos individualmente
import { collection, addDoc, serverTimestamp, doc, getDocs, updateDoc } from "firebase/firestore";

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
      .filter((item) => item.cantidad > 0);
    actualizarCarrito(actualizado);
  };

  const calcularTotal = () =>
    carrito.reduce((acc, item) => acc + item.costo * item.cantidad, 0);

  // Modificado para subir el pedido a Firebase y bajar el stock de los productos
  const finalizarCompra = async () => {
    if (carrito.length === 0) return;

    const usuarioActual = JSON.parse(localStorage.getItem("usuario_actual") || "{}");

    try {
      // 1. OBTENER LOS PRODUCTOS ACTUALES DE FIRESTORE PARA COMPROBAR EL STOCK REAL
      const querySnapshot = await getDocs(collection(db, "productos"));
      const productosFirebase = querySnapshot.docs.map(doc => ({
        firestoreId: doc.id, // ID interno de Firebase (ej: string largo de letras y números)
        ...doc.data()
      })) as any[];

      // 2. VALIDAR SI HAY STOCK PARA CADA ELEMENTO DEL CARRITO
      for (const item of carrito) {
        // Buscamos coincidencia ya sea por el ID numérico o name si tu Firestore los guardó así
        const prodMatch = productosFirebase.find(
          (p) => String(p.id) === String(item.id) || p.name?.toLowerCase() === item.name?.toLowerCase()
        );

        if (!prodMatch) {
          alert(`❌ El producto "${item.name}" ya no se encuentra registrado en el sistema.`);
          return;
        }

        if (prodMatch.stock < item.cantidad) {
          alert(`❌ Stock insuficiente para "${item.name}". Solo quedan ${prodMatch.stock} unidades disponibles.`);
          return;
        }
      }

      // 3. CONSTRUCCIÓN DEL OBJETO PEDIDO
      const nuevoPedido = {
        cliente: `${usuarioActual.nombre || ""} ${usuarioActual.apellido || ""}`.trim() || usuarioActual.correo || "Invitado",
        clienteId: usuarioActual.id || "",
        estado: "pendiente", 
        fechaCreacion: serverTimestamp(), 
        fechaActualizacion: serverTimestamp(),
        total: calcularTotal(),
        productos: carrito.map((item) => ({
          id: item.id,
          name: item.name,
          cantidad: item.cantidad,
          costo: item.costo,
        })),
      };

      // 4. GUARDAR EL PEDIDO EN LA COLECCIÓN 'PEDIDOS'
      await addDoc(collection(db, "pedidos"), nuevoPedido);

      // 5. 🔥 DESCONTAR EL STOCK DE LOS PRODUCTOS EN FIREBASE 🔥
      for (const item of carrito) {
        const prodMatch = productosFirebase.find(
          (p) => String(p.id) === String(item.id) || p.name?.toLowerCase() === item.name?.toLowerCase()
        );

        if (prodMatch) {
          const nuevoStock = Math.max(0, prodMatch.stock - item.cantidad);
          // Creamos la referencia al documento usando el ID único de Firestore
          const productoRef = doc(db, "productos", prodMatch.firestoreId);
          // Actualizamos de forma nativa el campo stock
          await updateDoc(productoRef, { stock: nuevoStock });
        }
      }

      // 6. LIMPIAR EL ESTADO LOCAL TRAS EL ÉXITO EN LA NUBE
      localStorage.removeItem("carrito");
      setCarrito([]);

      alert("✅ ¡Compra finalizada con éxito! Tu pedido fue generado y el stock actualizado.");
    } catch (error) {
      console.error("Error al procesar la compra o actualizar stock: ", error);
      alert("❌ Hubo un problema al procesar tu pedido. Inténtalo de nuevo.");
    }
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