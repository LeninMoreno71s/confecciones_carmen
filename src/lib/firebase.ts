import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// =========================================================================
// FUNCIONES DE AUTENTICACIÓN
// =========================================================================

/**
 * Registrar un nuevo usuario con email y contraseña
 */
export async function registrarUsuario(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { exito: true, user: userCredential.user };
  } catch (error: any) {
    let mensaje = "Error al registrar";
    if (error.code === "auth/email-already-in-use") {
      mensaje = "Este correo ya está registrado";
    } else if (error.code === "auth/weak-password") {
      mensaje = "La contraseña debe tener al menos 6 caracteres";
    } else if (error.code === "auth/invalid-email") {
      mensaje = "El correo no es válido";
    }
    return { exito: false, error: mensaje };
  }
}

/**
 * Iniciar sesión con email y contraseña
 */
export async function iniciarSesionUsuario(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { exito: true, user: userCredential.user };
  } catch (error: any) {
    let mensaje = "Error al iniciar sesión";
    if (error.code === "auth/user-not-found") {
      mensaje = "No existe una cuenta con este correo";
    } else if (error.code === "auth/wrong-password") {
      mensaje = "Contraseña incorrecta";
    } else if (error.code === "auth/invalid-email") {
      mensaje = "El correo no es válido";
    } else if (error.code === "auth/invalid-credential") {
      mensaje = "Credenciales incorrectas";
    }
    return { exito: false, error: mensaje };
  }
}

/**
 * Cerrar sesión
 */
export async function cerrarSesionUsuario() {
  try {
    await signOut(auth);
    return { exito: true };
  } catch (error) {
    return { exito: false, error: "Error al cerrar sesión" };
  }
}

/**
 * Escuchar cambios de autenticación
 */
export function escucharAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}