"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

// Función para escapar HTML (prevención XSS)
function escaparHTML(texto: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return texto.replace(/[&<>"']/g, (char) => map[char] || char);
}

// Función para sanitizar texto (elimina scripts y tags HTML)
function sanitizarTexto(texto: string): string {
  return texto
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Eliminar scripts
    .replace(/<[^>]*>/g, "")    // Eliminar tags HTML
    .replace(/javascript:/gi, "") // Eliminar javascript:
    .replace(/on\w+\s*=/gi, "")  // Eliminar eventos inline (onclick, onload, etc.)
    .trim();
}

// Función para sanitizar correo (más permisiva pero segura)
function sanitizarCorreo(correo: string): string {
  return correo
    .replace(/<[^>]*>/g, "")
    .replace(/['"]/g, "")
    .trim()
    .toLowerCase();
}

// Función para sanitizar teléfono (solo permite números y +)
function sanitizarTelefono(telefono: string): string {
  return telefono.replace(/[^\d+]/g, "").trim();
}

// Función para sanitizar nombre (solo letras, espacios y tildes)
function sanitizarNombre(texto: string): string {
  return texto
    .replace(/<[^>]*>/g, "")           // Eliminar tags HTML
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "") // Solo letras y espacios
    .trim();
}

interface ErroresValidacion {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  contraseña?: string;
  confirmarContraseña?: string;
}

export default function RegistroPage() {
  const router = useRouter();
  const { registrar } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [errores, setErrores] = useState<ErroresValidacion>({});
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Validar campo en tiempo real
  const validarCampo = (nombre: string, valor: string) => {
    const nuevosErrores = { ...errores };

    switch (nombre) {
      case "nombre":
        if (valor.length > 0) {
          if (valor.length < 2) {
            nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
          } else if (/\d/.test(valor)) {
            nuevosErrores.nombre = "El nombre no puede contener números";
          } else if (/<[^>]*>/.test(valor)) {
            nuevosErrores.nombre = "El nombre contiene caracteres no permitidos";
          } else if (valor.length > 50) {
            nuevosErrores.nombre = "El nombre no puede exceder 50 caracteres";
          } else {
            delete nuevosErrores.nombre;
          }
        } else {
          delete nuevosErrores.nombre;
        }
        break;

      case "apellido":
        if (valor.length > 0) {
          if (valor.length < 2) {
            nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres";
          } else if (/\d/.test(valor)) {
            nuevosErrores.apellido = "El apellido no puede contener números";
          } else if (/<[^>]*>/.test(valor)) {
            nuevosErrores.apellido = "El apellido contiene caracteres no permitidos";
          } else if (valor.length > 50) {
            nuevosErrores.apellido = "El apellido no puede exceder 50 caracteres";
          } else {
            delete nuevosErrores.apellido;
          }
        } else {
          delete nuevosErrores.apellido;
        }
        break;

      case "correo":
        if (valor.length > 0) {
          // Validar formato de correo chileno
          const regexCorreo = /^[^\s@]+@[^\s@]+\.(cl|com|net|org)$/i;
          if (!/@/.test(valor)) {
            nuevosErrores.correo = "El correo debe contener un @";
          } else if (!/\.(cl|com|net|org)$/i.test(valor)) {
            nuevosErrores.correo = 'El correo debe terminar en .cl, .com, .net o .org';
          } else if (!regexCorreo.test(valor)) {
            nuevosErrores.correo = "Ingresa un correo electrónico válido";
          } else if (/['"]/.test(valor)) {
            nuevosErrores.correo = "El correo contiene caracteres no permitidos";
          } else {
            delete nuevosErrores.correo;
          }
        } else {
          delete nuevosErrores.correo;
        }
        break;

      case "telefono":
        if (valor.length > 0) {
          // Eliminar caracteres no numéricos para validar
          const soloNumeros = valor.replace(/[^\d]/g, "");
          if (/[a-zA-Z]/.test(valor)) {
            nuevosErrores.telefono = "El teléfono no puede contener letras";
          } else if (soloNumeros.length < 9) {
            nuevosErrores.telefono = "El teléfono debe tener al menos 9 dígitos";
          } else if (soloNumeros.length > 15) {
            nuevosErrores.telefono = "El teléfono no puede exceder 15 dígitos";
          } else {
            delete nuevosErrores.telefono;
          }
        } else {
          delete nuevosErrores.telefono;
        }
        break;

      case "contraseña":
        if (valor.length > 0) {
          if (valor.length < 6) {
            nuevosErrores.contraseña = "La contraseña debe tener al menos 6 caracteres";
          } else if (valor.length > 50) {
            nuevosErrores.contraseña = "La contraseña no puede exceder 50 caracteres";
          } else if (!/[A-Z]/.test(valor)) {
            nuevosErrores.contraseña = "La contraseña debe contener al menos una mayúscula";
          } else if (!/[0-9]/.test(valor)) {
            nuevosErrores.contraseña = "La contraseña debe contener al menos un número";
          } else {
            delete nuevosErrores.contraseña;
          }
        } else {
          delete nuevosErrores.contraseña;
        }
        break;

      case "confirmarContraseña":
        if (valor.length > 0 && valor !== formData.contraseña) {
          nuevosErrores.confirmarContraseña = "Las contraseñas no coinciden";
        } else {
          delete nuevosErrores.confirmarContraseña;
        }
        break;
    }

    setErrores(nuevosErrores);
  };

  // Manejar cambios en inputs con sanitización
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let valorSanitizado = value;

    // Sanitizar según el tipo de campo
    switch (name) {
      case "nombre":
        valorSanitizado = sanitizarNombre(value);
        break;
      case "apellido":
        valorSanitizado = sanitizarNombre(value);
        break;
      case "correo":
        valorSanitizado = sanitizarCorreo(value);
        break;
      case "telefono":
        valorSanitizado = sanitizarTelefono(value);
        break;
      case "contraseña":
      case "confirmarContraseña":
        valorSanitizado = value.replace(/<[^>]*>/g, ""); // Solo eliminar tags HTML
        break;
    }

    const nuevosDatos = {
      ...formData,
      [name]: valorSanitizado,
    };
    setFormData(nuevosDatos);

    // Validar en tiempo real
    validarCampo(name, valorSanitizado);

    // Si cambió contraseña, también validar confirmación
    if (name === "contraseña" && formData.confirmarContraseña.length > 0) {
      validarCampo("confirmarContraseña", formData.confirmarContraseña);
    }
  };

  // Validar formulario completo
  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresValidacion = {};

    // Validar nombre
    if (formData.nombre.length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (/\d/.test(formData.nombre)) {
      nuevosErrores.nombre = "El nombre no puede contener números";
    }

    // Validar apellido
    if (formData.apellido.length < 2) {
      nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres";
    } else if (/\d/.test(formData.apellido)) {
      nuevosErrores.apellido = "El apellido no puede contener números";
    }

    // Validar correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.(cl|com|net|org)$/i;
    if (!regexCorreo.test(formData.correo)) {
      if (!/@/.test(formData.correo)) {
        nuevosErrores.correo = "El correo debe contener un @";
      } else if (!/\.(cl|com|net|org)$/i.test(formData.correo)) {
        nuevosErrores.correo = 'El correo debe terminar en .cl, .com, .net o .org';
      } else {
        nuevosErrores.correo = "Ingresa un correo electrónico válido";
      }
    }

    // Validar teléfono
    const soloNumeros = formData.telefono.replace(/[^\d]/g, "");
    if (soloNumeros.length < 9) {
      nuevosErrores.telefono = "El teléfono debe tener al menos 9 dígitos";
    }

    // Validar contraseña
    if (formData.contraseña.length < 6) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 6 caracteres";
    } else if (!/[A-Z]/.test(formData.contraseña)) {
      nuevosErrores.contraseña = "La contraseña debe contener al menos una mayúscula";
    } else if (!/[0-9]/.test(formData.contraseña)) {
      nuevosErrores.contraseña = "La contraseña debe contener al menos un número";
    }

    // Validar confirmación
    if (formData.contraseña !== formData.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // Validar formulario
    if (!validarFormulario()) {
      setError("Corrige los errores antes de continuar");
      setCargando(false);
      return;
    }

    // Sanitizar todos los datos antes de enviar
    const datosSanitizados = {
      nombre: escaparHTML(sanitizarNombre(formData.nombre)),
      apellido: escaparHTML(sanitizarNombre(formData.apellido)),
      correo: sanitizarCorreo(formData.correo),
      telefono: sanitizarTelefono(formData.telefono),
      contraseña: formData.contraseña,
    };

    // Intentar registrar
    const resultado = await registrar(datosSanitizados);
    setCargando(false);

    if (resultado) {
      setExito(true);
      setTimeout(() => {
        router.push("/login?registro=exitoso");
      }, 2000);
    } else {
      setError("Este correo ya está registrado. Intenta con otro.");
    }
  };

  // Estilo para inputs con error
  const inputStyle = (campo: keyof ErroresValidacion) => ({
    width: "100%" as const,
    padding: "0.75rem",
    border: errores[campo] ? "2px solid #dc3545" : "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s",
    outline: "none",
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F5F0E8 0%, #E8D5B7 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2.5rem",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#2b7a2b",
              marginBottom: "0.5rem",
            }}
          >
            Crear Cuenta
          </h1>
          <p style={{ color: "#6c757d", fontSize: "0.95rem" }}>
            Únete a Confecciones Carmen
          </p>
        </div>

        {/* Mensaje de éxito */}
        {exito && (
          <div
            style={{
              background: "#d4edda",
              color: "#155724",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            ✅ ¡Cuenta creada con éxito! Redirigiendo...
          </div>
        )}

        {/* Mensaje de error general */}
        {error && (
          <div
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontWeight: 600,
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre (solo letras)"
              maxLength={50}
              style={inputStyle("nombre")}
            />
            {errores.nombre && (
              <small style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                ⚠️ {errores.nombre}
              </small>
            )}
          </div>

          {/* Apellido */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontWeight: 600,
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Apellido *
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              placeholder="Tu apellido (solo letras)"
              maxLength={50}
              style={inputStyle("apellido")}
            />
            {errores.apellido && (
              <small style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                ⚠️ {errores.apellido}
              </small>
            )}
          </div>

          {/* Correo */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontWeight: 600,
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="correo@ejemplo.cl"
              style={inputStyle("correo")}
            />
            {errores.correo && (
              <small style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                ⚠️ {errores.correo}
              </small>
            )}
            <small style={{ color: "#6c757d", fontSize: "0.75rem" }}>
              Debe contener @ y terminar en .cl, .com, .net o .org
            </small>
          </div>

          {/* Teléfono */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontWeight: 600,
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="+56 9 1234 5678 (solo números)"
              maxLength={15}
              style={inputStyle("telefono")}
            />
            {errores.telefono && (
              <small style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                ⚠️ {errores.telefono}
              </small>
            )}
            <small style={{ color: "#6c757d", fontSize: "0.75rem" }}>
              Mínimo 9 dígitos, no se permiten letras
            </small>
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontWeight: 600,
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Contraseña *
            </label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
              maxLength={50}
              style={inputStyle("contraseña")}
            />
            {errores.contraseña && (
              <small style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                ⚠️ {errores.contraseña}
              </small>
            )}
            <small style={{ color: "#6c757d", fontSize: "0.75rem" }}>
              Mínimo 6 caracteres, 1 mayúscula y 1 número
            </small>
          </div>

          {/* Confirmar Contraseña */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontWeight: 600,
                color: "#333",
                fontSize: "0.9rem",
              }}
            >
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
              maxLength={50}
              style={inputStyle("confirmarContraseña")}
            />
            {errores.confirmarContraseña && (
              <small style={{ color: "#dc3545", fontSize: "0.8rem" }}>
                ⚠️ {errores.confirmarContraseña}
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: cargando
                ? "#6c757d"
                : "linear-gradient(135deg, #2b7a2b, #1e5e1e)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: cargando ? "not-allowed" : "pointer",
              marginBottom: "1.5rem",
              transition: "transform 0.2s",
            }}
          >
            {cargando ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              style={{
                color: "#2b7a2b",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}