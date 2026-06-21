"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipo de usuario
interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol?: string; // Agregado para soportar rol de admin
}

// Tipo del contexto
interface AuthContextType {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  cargandoAuth: boolean;
  registrar: (datos: Omit<Usuario, "id"> & { contraseña: string }) => boolean;
  iniciarSesion: (correo: string, contraseña: string) => boolean;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // Cargar usuario del localStorage al iniciar
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

  // Registrar nuevo usuario
  const registrar = (datos: Omit<Usuario, "id"> & { contraseña: string }): boolean => {
    try {
      // Obtener usuarios existentes
      const usuariosExistentes = JSON.parse(
        localStorage.getItem("usuarios_registrados") || "[]"
      );

      // Verificar si el correo ya existe
      const existe = usuariosExistentes.find(
        (u: Usuario) => u.correo === datos.correo
      );
      if (existe) {
        return false; // Correo ya registrado
      }

      // Crear nuevo usuario con ID único
      const nuevoUsuario: Usuario & { contraseña: string } = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        telefono: datos.telefono,
        contraseña: datos.contraseña,
        rol: "cliente", // Por defecto los que se registran son clientes
      };

      // Guardar en localStorage
      usuariosExistentes.push(nuevoUsuario);
      localStorage.setItem(
        "usuarios_registrados",
        JSON.stringify(usuariosExistentes)
      );

      return true;
    } catch (error) {
      console.error("Error al registrar:", error);
      return false;
    }
  };

  // Iniciar sesión
  const iniciarSesion = (correo: string, contraseña: string): boolean => {
    try {
      const usuariosExistentes = JSON.parse(
        localStorage.getItem("usuarios_registrados") || "[]"
      );

      const usuarioEncontrado = usuariosExistentes.find(
        (u: Usuario & { contraseña?: string }) => u.correo === correo && u.contraseña === contraseña
      );

      if (usuarioEncontrado) {
        // Guardar sesión actual (sin contraseña)
        const { contraseña: _, ...usuarioSinPass } = usuarioEncontrado;
        setUsuario(usuarioSinPass);
        setEstaAutenticado(true);
        localStorage.setItem(
          "usuario_actual",
          JSON.stringify(usuarioSinPass)
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  // Cerrar sesión
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