// src/lib/firestore.ts
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// =========================================================================
// FUNCIONES GENÉRICAS CRUD
// =========================================================================

/**
 * Crear o sobrescribir un documento
 * @param coleccion - Nombre de la colección
 * @param id - ID del documento
 * @param datos - Datos a guardar
 */
export async function guardarDocumento(
  coleccion: string,
  id: string,
  datos: any
) {
  try {
    const docRef = doc(db, coleccion, id);
    await setDoc(docRef, {
      ...datos,
      fechaActualizacion: Timestamp.now(),
    });
    return { exito: true };
  } catch (error) {
    console.error(`Error al guardar en ${coleccion}:`, error);
    return { exito: false, error };
  }
}

/**
 * Agregar un documento con ID automático
 * @param coleccion - Nombre de la colección
 * @param datos - Datos a guardar
 */
export async function agregarDocumento(coleccion: string, datos: any) {
  try {
    const docRef = await addDoc(collection(db, coleccion), {
      ...datos,
      fechaCreacion: Timestamp.now(),
      fechaActualizacion: Timestamp.now(),
    });
    return { exito: true, id: docRef.id };
  } catch (error) {
    console.error(`Error al agregar en ${coleccion}:`, error);
    return { exito: false, error };
  }
}

/**
 * Obtener un documento por ID
 * @param coleccion - Nombre de la colección
 * @param id - ID del documento
 */
export async function obtenerDocumento(coleccion: string, id: string) {
  try {
    const docRef = doc(db, coleccion, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { exito: true, datos: { id: docSnap.id, ...docSnap.data() } };
    }
    return { exito: false, error: "Documento no encontrado" };
  } catch (error) {
    console.error(`Error al obtener de ${coleccion}:`, error);
    return { exito: false, error };
  }
}

/**
 * Obtener todos los documentos de una colección
 * @param coleccion - Nombre de la colección
 */
export async function obtenerTodos(coleccion: string) {
  try {
    const querySnapshot = await getDocs(collection(db, coleccion));
    const documentos: any[] = [];
    querySnapshot.forEach((doc) => {
      documentos.push({ id: doc.id, ...doc.data() });
    });
    return { exito: true, datos: documentos };
  } catch (error) {
    console.error(`Error al obtener de ${coleccion}:`, error);
    return { exito: false, error };
  }
}

/**
 * Actualizar un documento
 * @param coleccion - Nombre de la colección
 * @param id - ID del documento
 * @param datos - Datos a actualizar
 */
export async function actualizarDocumento(
  coleccion: string,
  id: string,
  datos: any
) {
  try {
    const docRef = doc(db, coleccion, id);
    await updateDoc(docRef, {
      ...datos,
      fechaActualizacion: Timestamp.now(),
    });
    return { exito: true };
  } catch (error) {
    console.error(`Error al actualizar ${coleccion}:`, error);
    return { exito: false, error };
  }
}

/**
 * Eliminar un documento
 * @param coleccion - Nombre de la colección
 * @param id - ID del documento
 */
export async function eliminarDocumento(coleccion: string, id: string) {
  try {
    const docRef = doc(db, coleccion, id);
    await deleteDoc(docRef);
    return { exito: true };
  } catch (error) {
    console.error(`Error al eliminar de ${coleccion}:`, error);
    return { exito: false, error };
  }
}

/**
 * Buscar documentos por campo
 * @param coleccion - Nombre de la colección
 * @param campo - Campo a buscar
 * @param valor - Valor a buscar
 */
export async function buscarPorCampo(
  coleccion: string,
  campo: string,
  valor: any
) {
  try {
    const q = query(collection(db, coleccion), where(campo, "==", valor));
    const querySnapshot = await getDocs(q);
    const documentos: any[] = [];
    querySnapshot.forEach((doc) => {
      documentos.push({ id: doc.id, ...doc.data() });
    });
    return { exito: true, datos: documentos };
  } catch (error) {
    console.error(`Error al buscar en ${coleccion}:`, error);
    return { exito: false, error };
  }
}