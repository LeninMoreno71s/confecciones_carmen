"use client";

import { useState, useEffect } from "react";
import { agregarDocumento, obtenerTodos, buscarPorCampo } from "../../lib/firestore";
import { useAuth } from "../context/AuthContext";

export default function TestFirebasePage() {
  const { usuario, estaAutenticado, registrar, iniciarSesion, cerrarSesion } = useAuth();
  
  const [resultados, setResultados] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estadoConexion, setEstadoConexion] = useState("No probada");

  // Función para agregar un log
  const log = (mensaje: string) => {
    setResultados((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${mensaje}`]);
  };

  // =========================================================================
  // PRUEBA 1: Verificar conexión a Firestore
  // =========================================================================
  const probarConexion = async () => {
    log("🔍 Probando conexión a Firestore...");
    setEstadoConexion("Probando...");
    
    try {
      const resultado = await obtenerTodos("usuarios");
      if (resultado.exito) {
        log(`✅ Conexión exitosa! ${resultado.datos.length} usuarios encontrados`);
        resultado.datos.forEach((u: any) => {
          log(`   📄 ${u.nombre} ${u.apellido} - ${u.correo} (${u.rol})`);
        });
        setEstadoConexion("✅ Conectado");
      } else {
        log(`❌ Error: ${resultado.error}`);
        setEstadoConexion("❌ Error");
      }
    } catch (error) {
      log(`❌ Error de conexión: ${error}`);
      setEstadoConexion("❌ Error");
    }
  };

  // =========================================================================
  // PRUEBA 2: Crear un usuario de prueba
  // =========================================================================
  const probarCrearUsuario = async () => {
    log("🔍 Probando crear usuario en Firestore...");
    
    const usuarioPrueba = {
      nombre: "Test",
      apellido: "Firebase",
      correo: `test${Date.now()}@mail.cl`,
      telefono: "123456789",
      contraseña: "Test123",
      rol: "cliente",
    };

    const resultado = await agregarDocumento("usuarios", usuarioPrueba);
    if (resultado.exito) {
      log(`✅ Usuario creado con ID: ${resultado.id}`);
    } else {
      log(`❌ Error al crear usuario: ${resultado.error}`);
    }
  };

  // =========================================================================
  // PRUEBA 3: Buscar usuario por correo
  // =========================================================================
  const probarBuscarUsuario = async (correo: string) => {
    log(`🔍 Buscando usuario: ${correo}`);
    
    const resultado = await buscarPorCampo("usuarios", "correo", correo);
    if (resultado.exito && resultado.datos.length > 0) {
      const u = resultado.datos[0];
      log(`✅ Encontrado: ${u.nombre} ${u.apellido} (${u.rol})`);
    } else {
      log(`❌ No encontrado`);
    }
  };

  // =========================================================================
  // PRUEBA 4: Registrar usuario con AuthContext
  // =========================================================================
  const probarRegistrar = async () => {
    log("🔍 Probando registro con AuthContext...");
    
    const resultado = await registrar({
      nombre: "Nuevo",
      apellido: "Cliente",
      correo: `nuevo${Date.now()}@mail.cl`,
      telefono: "987654321",
      contraseña: "Test123",
    });

    if (resultado) {
      log("✅ Registro exitoso con AuthContext!");
    } else {
      log("❌ El correo ya existe o hubo un error");
    }
  };

  // =========================================================================
  // PRUEBA 5: Iniciar sesión
  // =========================================================================
  const probarLogin = async () => {
    log(`🔍 Probando login: ${email}`);
    
    const resultado = await iniciarSesion(email, password);
    if (resultado) {
      log("✅ Login exitoso!");
    } else {
      log("❌ Credenciales incorrectas");
    }
  };

  // =========================================================================
  // PRUEBA 6: Verificar estado actual
  // =========================================================================
  const probarEstado = () => {
    log(`📊 Estado: autenticado=${estaAutenticado}, usuario=${usuario?.nombre || "null"}`);
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#2b7a2b", marginBottom: "1rem" }}>
        🧪 Prueba de Firebase AuthContext
      </h1>

      {/* Estado de conexión */}
      <div style={{
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        background: estadoConexion.includes("✅") ? "#d4edda" : 
                    estadoConexion.includes("❌") ? "#f8d7da" : "#fff3cd",
      }}>
        <strong>Estado: {estadoConexion}</strong>
        {usuario && (
          <span> | 👤 {usuario.nombre} {usuario.apellido}</span>
        )}
      </div>

      {/* Botones de prueba */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={probarConexion} style={botonEstilo}>
          🔍 Probar Conexión
        </button>
        <button onClick={probarCrearUsuario} style={botonEstilo}>
          ➕ Crear Usuario
        </button>
        <button onClick={() => probarBuscarUsuario("test@mail.cl")} style={botonEstilo}>
          🔎 Buscar Usuario
        </button>
        <button onClick={probarRegistrar} style={botonEstilo}>
          📝 Registrar (AuthContext)
        </button>
        <button onClick={probarEstado} style={botonEstilo}>
          📊 Ver Estado
        </button>
      </div>

      {/* Login de prueba */}
      <div style={{
        padding: "1rem",
        background: "#f8f9fa",
        borderRadius: "8px",
        marginBottom: "1rem",
      }}>
        <h5>Probar Login:</h5>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@mail.cl"
            style={inputEstilo}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            style={inputEstilo}
          />
          <button onClick={probarLogin} style={botonEstilo}>
            🔐 Iniciar Sesión
          </button>
          {estaAutenticado && (
            <button onClick={cerrarSesion} style={{ ...botonEstilo, background: "#dc3545" }}>
              🚪 Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div style={{
        background: "#1e1e1e",
        color: "#d4d4d4",
        borderRadius: "8px",
        padding: "1rem",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        maxHeight: "400px",
        overflow: "auto",
      }}>
        <h5 style={{ color: "#569cd6" }}>📋 Resultados:</h5>
        {resultados.length === 0 ? (
          <p style={{ color: "#6c757d" }}>Haz clic en los botones para probar...</p>
        ) : (
          resultados.map((linea, i) => (
            <div key={i} style={{
              color: linea.includes("✅") ? "#4ec9b0" : 
                     linea.includes("❌") ? "#f44747" : 
                     linea.includes("🔍") ? "#569cd6" : "#d4d4d4",
            }}>
              {linea}
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setResultados([])}
        style={{ ...botonEstilo, background: "#6c757d", marginTop: "0.5rem" }}
      >
        🧹 Limpiar Resultados
      </button>
    </main>
  );
}

// Estilos reutilizables
const botonEstilo: React.CSSProperties = {
  padding: "0.5rem 1rem",
  background: "#2b7a2b",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.85rem",
};

const inputEstilo: React.CSSProperties = {
  padding: "0.5rem",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "0.9rem",
  flex: "1",
  minWidth: "150px",
};