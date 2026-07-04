"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { agregarDocumento, buscarPorCampo, obtenerTodos } from "../../lib/firestore";

// Tipo de usuario
interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol?: string;
}

// Tipo del contexto
interface AuthContextType {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  cargandoAuth: boolean;
  registrar: (datos: Omit<Usuario, "id"> & { contraseña: string }) => Promise<boolean>;
  iniciarSesion: (correo: string, contraseña: string) => Promise<boolean>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // Cargar usuario del localStorage al iniciar (mantenemos esto por ahora)
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario_actual");
    if (usuarioGuardado) {
      try {
        const parsed = JSON.parse(usuarioGuardado);
        setUsuario(parsed);
        setEstaAutenticado(true);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    }
    setCargandoAuth(false);
  }, []);

  // Registrar nuevo usuario (AHORA EN FIRESTORE)
  const registrar = async (datos: Omit<Usuario, "id"> & { contraseña: string }): Promise<boolean> => {
    try {
      // Verificar si el correo ya existe
      const existe = await buscarPorCampo("usuarios", "correo", datos.correo);
      if (existe.exito && existe.datos.length > 0) {
        return false; // Correo ya registrado
      }

      // Crear nuevo usuario
      const nuevoUsuario = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        telefono: datos.telefono,
        contraseña: datos.contraseña,
        rol: "cliente",
      };

      const resultado = await agregarDocumento("usuarios", nuevoUsuario);
      return resultado.exito;
    } catch (error) {
      console.error("Error al registrar:", error);
      return false;
    }
  };

  // Iniciar sesión (AHORA EN FIRESTORE)
  const iniciarSesion = async (correo: string, contraseña: string): Promise<boolean> => {
    try {
      const resultado = await buscarPorCampo("usuarios", "correo", correo);
      
      if (resultado.exito && resultado.datos.length > 0) {
        const usuarioEncontrado = resultado.datos[0];
        
        if (usuarioEncontrado.contraseña === contraseña) {
          // Guardar sesión (sin contraseña)
          const { contraseña: _, ...usuarioSinPass } = usuarioEncontrado;
          setUsuario(usuarioSinPass);
          setEstaAutenticado(true);
          localStorage.setItem("usuario_actual", JSON.stringify(usuarioSinPass));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  // Cerrar sesión (sin cambios)
  const cerrarSesion = () => {
    setUsuario(null);
    setEstaAutenticado(false);
    localStorage.removeItem("usuario_actual");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado,
        cargandoAuth,
        registrar,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}