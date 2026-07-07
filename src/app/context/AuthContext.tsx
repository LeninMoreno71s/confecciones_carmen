"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { escucharAuth, cerrarSesionUsuario } from "../../lib/firebase";
import { agregarDocumento, guardarDocumento, obtenerDocumento, buscarPorCampo } from "../../lib/firestore";

interface Usuario {
  uid: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  firebaseUser: User | null;
  estaAutenticado: boolean;
  cargandoAuth: boolean;
  registrar: (datos: { nombre: string; apellido: string; correo: string; telefono: string; contraseña: string }) => Promise<{ exito: boolean; error?: string }>;
  iniciarSesion: (correo: string, contraseña: string) => Promise<{ exito: boolean; error?: string }>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // Escuchar cambios de autenticación
  useEffect(() => {
    // 1. Escuchar Firebase Auth (para clientes)
    const unsubscribe = escucharAuth(async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        // Cliente autenticado con Firebase
        const resultado = await obtenerDocumento("usuarios", user.uid);
        if (resultado.exito && resultado.datos) {
          setUsuario({
            uid: user.uid,
            ...resultado.datos,
          });
        } else {
          setUsuario({
            uid: user.uid,
            nombre: user.displayName || "",
            apellido: "",
            correo: user.email || "",
            telefono: "",
            rol: "cliente",
          });
        }
        setEstaAutenticado(true);
      } else {
        // ✅ 2. Verificar si hay admin en localStorage
        const adminGuardado = localStorage.getItem("usuario_actual");
        if (adminGuardado) {
          try {
            const admin = JSON.parse(adminGuardado);
            if (admin.rol === "admin") {
              setUsuario(admin);
              setEstaAutenticado(true);
            } else {
              setUsuario(null);
              setEstaAutenticado(false);
            }
          } catch (error) {
            setUsuario(null);
            setEstaAutenticado(false);
          }
        } else {
          setUsuario(null);
          setEstaAutenticado(false);
        }
      }
      setCargandoAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Registrar nuevo usuario

  const registrar = async (datos: { nombre: string; apellido: string; correo: string; telefono: string; contraseña: string }) => {
    const { registrarUsuario } = await import("../../lib/firebase");
    
    const resultado = await registrarUsuario(datos.correo, datos.contraseña);
    
    if (resultado.exito && resultado.user) {
      // ✅ Usar guardarDocumento con el UID de Firebase como ID
      await guardarDocumento("usuarios", resultado.user.uid, {
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        telefono: datos.telefono,
        rol: "cliente",
      });
      return { exito: true };
    }
    
    return { exito: false, error: resultado.error };
  };
  // Iniciar sesión
  const iniciarSesion = async (correo: string, contraseña: string) => {
    const { iniciarSesionUsuario } = await import("../../lib/firebase");
    const resultado = await iniciarSesionUsuario(correo, contraseña);
    
    if (resultado.exito) {
      return { exito: true };
    }
    
    return { exito: false, error: resultado.error };
  };

  // Cerrar sesión
  const cerrarSesion = async () => {
    await cerrarSesionUsuario();
    setUsuario(null);
    setEstaAutenticado(false);
    localStorage.removeItem("usuario_actual");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        firebaseUser,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}