# Evaluación Sumativa 3 - Programación FrontEnd
**Intranet Confecciones Carmen**


## 1. Contexto del Proyecto
Este proyecto es el desarrollo de una intranet para el emprendimiento "Confecciones Carmen", el cual se dedica a la confección y arriendo de trajes y accesorios. El objetivo de esta intranet es permitir a los administradores de la tienda (usuarios internos) gestionar la información clave del negocio.

Actualmente, el sistema funciona con persistencia local (`localStorage`)

## 2. Instrucciones para Ejecutar Localmente

Sigue estos pasos para clonar y levantar el proyecto en tu entorno de desarrollo:

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd confecciones_carmen
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en la siguiente dirección:
   [http://localhost:3000](http://localhost:3000)

## 3. Módulos Implementados

El sistema cuenta con un sistema de Autenticación y 4 módulos principales:

### a) Autenticación y Sesión (Login)
* Permite diferenciar entre clientes y un usuario administrador. 
* Credenciales de administrador por defecto: `admin@confeccionescarmen.cl` / `admin123`.
* Protege las rutas internas redirigiendo a los usuarios no logueados. 

### b) Módulo de Productos (CRUD)
* Permite gestionar el inventario de la tienda.
* **Características:** Crear nuevos productos, ver listado, modificar stock (aumentar o disminuir) y eliminar registros con confirmación visual.
* Persiste en `localStorage` bajo la clave `productos`.

### c) Módulo de Publicaciones (CRUD)
* Permite gestionar noticias o anuncios de la tienda.
* **Características:** Rutas dinámicas (`/publicaciones/[id]`) para editar y ver detalle, crear nuevas publicaciones, buscar por título y eliminar registros.
* Persiste en `localStorage` bajo la clave `publicaciones`.

### d) Módulo de Pedidos
* Visualiza las compras o pedidos realizados por los clientes en el carrito.
* Administra los estados de preparación o entrega.

### e) Módulo de Citas
* Permite administrar el agendamiento de horas (ej. para medidas de trajes).
* Los administradores pueden "Aceptar" o "Rechazar" una cita y añadir comentarios mediante un modal.


