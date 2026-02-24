# Sistema de Gestion Veterinaria "Patitas Felices"

Proyecto final para la materia **Backend** de la **UTN**. Sistema integral de gestion veterinaria que permite administrar duenos, mascotas, veterinarios, turnos e historial clinico con autenticacion basada en JWT y roles.

---

## Tecnologias Utilizadas

### Backend
| Tecnologia | Uso |
|---|---|
| **Node.js** + **Express** | Servidor y API RESTful |
| **TypeScript** | Tipado estatico en todo el proyecto |
| **MySQL** + **mysql2** | Base de datos relacional con pool de conexiones |
| **JWT** (jsonwebtoken) | Autenticacion y proteccion de rutas |
| **Bcrypt** | Encriptacion de contrasenas |
| **express-validator** | Validacion de datos de entrada |
| **dotenv** | Manejo de variables de entorno |
| **CORS** | Control de acceso entre dominios |

### Frontend
| Tecnologia | Uso |
|---|---|
| **React** + **Vite** | Interfaz de usuario SPA |
| **Redux Toolkit** | Gestion de estado global |
| **React Router** | Navegacion y rutas protegidas |
| **TypeScript** | Tipado estatico |

### Arquitectura
- Patron **MVC** (Model - View - Controller) con capa de **Services**
- DTOs para transferencia de datos
- Middleware centralizado de errores
- Middleware de autenticacion y autorizacion por roles

---

## Opcion de Frontend

Se eligio la **Opcion 3: React** como frontend desacoplado dentro del mismo repositorio (carpeta `/FrontEnd`). El frontend consume la API del backend y permite realizar un **CRUD completo** de mascotas, turnos, historial clinico y gestion de veterinarios.

---

## Instalacion y Configuracion

### Requisitos Previos
- **Node.js** (v18 o superior)
- **MySQL** (v8 o superior)
- **npm** (incluido con Node.js)

### Paso a Paso

```bash
# Clonar el repositorio
git clone https://github.com/cruz-jenifer/Tp-Final-Jenifer-Cruz.git
cd Tp-Final-Jenifer-Cruz

# Instalar dependencias del backend (raiz del proyecto)
npm install

# Instalar dependencias del frontend
cd FrontEnd
npm install
cd ..
```

### Configuracion de Base de Datos

1. Crear una base de datos en MySQL:
```sql
CREATE DATABASE veterinaria_patitas_felices;
```

2. Importar la estructura desde el dump incluido:
```bash
mysql -u root -p veterinaria_patitas_felices < bd_limpio.sql
```

3. Configurar las variables de entorno (ver seccion siguiente).

4. Ejecutar el seed para cargar datos iniciales:
```bash
npm run db:seed:full
```

### Ejecucion

```bash
# Terminal 1 - Backend (puerto 3001)
npm run dev

# Terminal 2 - Frontend (puerto 5173)
cd FrontEnd
npm run dev
```

---

## Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto usando `.env.example` como base:

| Variable | Descripcion | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor backend | `3001` |
| `NODE_ENV` | Entorno de ejecucion | `development` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contrasena de MySQL | - |
| `DB_NAME` | Nombre de la base de datos | `veterinaria_patitas_felices` |
| `JWT_SECRET` | Clave secreta para firmar tokens | - |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:5173` |

---

## Estructura del Proyecto

```
Tp-Final-Jenifer-Cruz/
├── BackEnd/
│   └── src/
│       ├── config/          # Configuracion de base de datos
│       ├── controllers/     # Controladores (logica de request/response)
│       ├── middlewares/      # Auth y manejo de errores
│       ├── models/          # Modelos de datos (queries SQL)
│       ├── routes/          # Definicion de rutas
│       ├── scripts/         # Seeds y utilidades
│       ├── services/        # Logica de negocio
│       ├── types/           # Interfaces, DTOs y enums
│       ├── validators/      # Validaciones con express-validator
│       └── tests/           # Tests de integracion
├── FrontEnd/
│   └── src/
│       ├── components/      # Componentes reutilizables
│       ├── features/        # Modulos por funcionalidad
│       ├── store/           # Redux store y slices
│       └── ...
├── bd_limpio.sql            # Dump de la base de datos
├── tp_final_collection.json # Coleccion de Postman
├── .env.example             # Plantilla de variables de entorno
└── README.md
```

---

## Endpoints de la API

Todas las rutas protegidas requieren el header `Authorization: Bearer <token>`.

### Autenticacion (`/api/auth`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `POST` | `/auth/register` | Registrar nuevo usuario | Publico |
| `POST` | `/auth/login` | Iniciar sesion y obtener token | Publico |

### Duenos (`/api/duenos`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `POST` | `/duenos/perfil` | Crear perfil de dueno | Autenticado |
| `GET` | `/duenos/perfil` | Obtener mi perfil | Autenticado |
| `PUT` | `/duenos/perfil` | Actualizar mi perfil | Autenticado |
| `GET` | `/duenos` | Listar todos los duenos | Admin |
| `POST` | `/duenos` | Crear dueno desde admin | Admin |
| `DELETE` | `/duenos/:id` | Eliminar dueno | Admin |

### Mascotas (`/api/mascotas`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `GET` | `/mascotas` | Listar mis mascotas | Autenticado |
| `GET` | `/mascotas/:id` | Obtener mascota por ID | Autenticado |
| `POST` | `/mascotas` | Registrar nueva mascota | Autenticado |
| `PUT` | `/mascotas/:id` | Actualizar mascota | Autenticado |
| `DELETE` | `/mascotas/:id` | Eliminar mascota | Autenticado |
| `GET` | `/mascotas/admin/all` | Listar todas las mascotas | Admin |

### Turnos (`/api/turnos`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `GET` | `/turnos/mis-turnos` | Listar mis turnos | Cliente/Admin |
| `GET` | `/turnos/agenda` | Ver agenda global | Admin |
| `GET` | `/turnos/check-availability` | Verificar disponibilidad | Autenticado |
| `POST` | `/turnos` | Reservar turno | Autenticado |
| `GET` | `/turnos/:id` | Detalle de un turno | Autenticado |
| `PUT` | `/turnos/:id` | Reprogramar turno | Autenticado |
| `DELETE` | `/turnos/:id` | Cancelar turno | Autenticado |

### Historial Medico (`/api/historial`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `POST` | `/historial` | Crear registro medico | Veterinario/Admin |
| `GET` | `/historial/:id` | Historial por mascota | Cliente/Vet/Admin |
| `GET` | `/historial/admin/all` | Listar todos los historiales | Admin |
| `PUT` | `/historial/:id` | Actualizar registro | Veterinario/Admin |
| `DELETE` | `/historial/:id` | Eliminar registro | Veterinario/Admin |

### Veterinarios (`/api/veterinarios`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `GET` | `/veterinarios` | Listar veterinarios | Autenticado |
| `POST` | `/veterinarios` | Crear veterinario | Admin |
| `PUT` | `/veterinarios/:id` | Actualizar veterinario | Admin |
| `DELETE` | `/veterinarios/:id` | Eliminar veterinario | Admin |
| `GET` | `/veterinarios/agenda` | Ver agenda del veterinario | Veterinario/Admin |
| `GET` | `/veterinarios/historial-reciente` | Historial reciente | Veterinario/Admin |

### Servicios (`/api/servicios`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `GET` | `/servicios` | Listar tipos de servicios | Publico |

### Razas (`/api/razas`)

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| `GET` | `/razas` | Listar razas disponibles | Autenticado |

---

## Coleccion de Pruebas

El archivo `tp_final_collection.json` en la raiz del proyecto contiene una coleccion de **Postman** con todos los endpoints documentados. Para usarla:

1. Abrir **Postman**.
2. Importar el archivo `tp_final_collection.json`.
3. Ejecutar el endpoint de **Login** para obtener un token.
4. Copiar el token en la variable `token` de la coleccion.
5. Probar los endpoints protegidos.

---

## Base de Datos

Se utiliza **MySQL** con el archivo `bd_limpio.sql` como dump de la estructura.

### Entidades Principales
- **usuarios** - Sistema de autenticacion con roles
- **duenos** - Perfil extendido del cliente
- **mascotas** - Registro de animales con raza y especie
- **veterinarios** - Personal medico con matricula
- **turnos** - Agenda de citas con estados
- **historial_medico** - Registros clinicos por mascota
- **roles**, **especies**, **razas**, **tipos_servicios** - Tablas de catalogo

---

## Usuarios de Prueba

Despues de ejecutar `npm run db:seed:full`:

| Rol | Email | Contrasena |
|---|---|---|
| Administrador | `admin@patitas.com` | `admin123` |
| Veterinario | `vet@patitas.com` | `admin123` |
| Cliente | `cliente@patitas.com` | `admin123` |

---

## Scripts Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el backend en modo desarrollo |
| `npm run db:seed:full` | Carga datos iniciales completos |
| `npm run db:seed` | Carga solo razas |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia el backend compilado |

---

## Autor

**Jenifer Cruz** - TP Final Backend UTN 2026
