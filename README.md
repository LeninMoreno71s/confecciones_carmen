# Evaluación Sumativa 4 - Programación FrontEnd
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

* Credenciales de administrador por defecto: admin@confeccionescarmen.cl / admin123.

* Protege las rutas internas redirigiendo a los usuarios no logueados.

* Persistencia: Firestore (colección usuarios) + localStorage para sesión activa.

### b) Módulo de Productos (CRUD)
* Permite gestionar el inventario de la tienda.

* Características: Crear nuevos productos, ver listado, modificar stock (aumentar o disminuir) y eliminar registros con confirmación visual.

* Persistencia: Firestore (colección productos).

* Colección en Firestore: productos → { name, descripcion, categoria, costo, stock, image }

### c) Módulo de Publicaciones (CRUD)
* Permite gestionar noticias o anuncios de la tienda.

* Características: Rutas dinámicas (/publicaciones/[id]) para editar y ver detalle, crear nuevas publicaciones con subida de imágenes, buscar por título y eliminar registros.

* Persistencia: Firestore (colección publicaciones).

* Colección en Firestore: publicaciones → { titulo, contenido, imagen, fechaCreacion, autorId }

### d) Módulo de Pedidos
* Visualiza las compras o pedidos realizados por los clientes en el carrito.

* Administra los estados: Pendiente, En preparación, Entregado, Cancelado.

* Incluye estadísticas de total de pedidos, pendientes y entregados.

* Persistencia: Firestore (colección pedidos).

* Colección en Firestore: pedidos → { cliente, productos: [...], fecha, estado, total }

### e) Módulo de Citas
* Visualiza las compras o pedidos realizados por los clientes en el carrito.

* Administra los estados: Pendiente, En preparación, Entregado, Cancelado.

* Incluye estadísticas de total de pedidos, pendientes y entregados.

* Persistencia: Firestore (colección pedidos).

* Colección en Firestore: pedidos → { cliente, productos: [...], fecha, estado, total }

### 3.2 Configurar las variables de entorno (Firebase)

El proyecto utiliza variables de entorno para almacenar las credenciales de Firebase de forma segura. Estas credenciales no se suben al repositorio.

1.-El usuario debe ir a Firebase Console
2.-Seleccionar su proyecto
3.-En el menú izquierdo, hacer clic en ⚙️ Project Settings (Configuración del proyecto)
4.-En la pestaña General, baja hasta la sección "Your apps"
5.-Selecciona tu aplicación web (si no hay una, haz clic en el ícono </> para agregar una)
6.-En "SDK setup and configuration", selecciona la opción "Config"
7.-Copia los valores del bloque firebaseConfig a tu archivo .env.local:


