export interface Cita {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  fecha: string;       // formato: "YYYY-MM-DD"
  hora: string;        // formato: "HH:MM"
  motivo: string;
  estado: "pendiente" | "aceptada" | "rechazada";
  fechaCreacion: string;
  adminComentario?: string;
}