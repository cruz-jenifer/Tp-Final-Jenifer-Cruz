# 🐾 Sistema de Gestión Veterinaria "Patitas Felices"

Este es el proyecto final para el curso de Backend de la **UTN**. Es una aplicación integral de gestión veterinaria que permite administrar turnos, mascotas, historias clínicas y perfiles de usuarios.

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** & **Express**
- **TypeScript** (Tipado estricto, 0 `any`)
- **MySQL2** (Pool de conexiones, consultas parametrizadas)
- **JWT** (Autenticación protegida)
- **Bcrypt** (Hasheo de contraseñas)
- **MVC Architecture** (Model-View-Service-Controller)

### Frontend
- **React** + **Vite**
- **Redux Toolkit** (Gestión de estado global)
- **Tailwind CSS** (Diseño moderno y responsive)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio e instalar dependencias
```bash
# Instalar dependencias del proyecto raíz (Backend)
npm install

# Instalar dependencias del Frontend
cd FrontEnd
npm install
```

### 2. Configuración de Base de Datos
1.  Crea una base de datos en MySQL llamada `veterinaria_patitas_felices`.
2.  Importa el archivo `bd_limpio.sql` que se encuentra en la raíz para generar la estructura.
3.  Configura tu archivo `.env` en la raíz (puedes usar el `.env.example` como base).

### 3. Inicialización (Seeding)
Para cargar los datos base y usuarios de prueba (Admin, Vet, Cliente) ejecuta:
```bash
npm run db:seed:full
```

---

## 📖 Documentación de la API

### Colección de Postman
En la raíz del proyecto encontrarás el archivo `tp_final_collection.json`. Puedes importarlo en Postman para probar todos los endpoints documentados:
- **Auth**: Registro y Login.
- **Mascotas**: CRUD completo (con validación de dueño).
- **Turnos**: Gestión de agenda y citas.
- **Historial**: Reportes médicos (exclusivo Veterinaria/Admin).

### Endpoints Principales
- `POST /api/auth/login`: Autenticación.
- `GET /api/mascotas/mis-mascotas`: Lista tus mascotas.
- `POST /api/turnos`: Reserva una cita.
- `DELETE /api/turnos/:id`: Cancela o elimina un turno.

---

## 👥 Usuarios de Prueba (Pass: admin123)
- **Administrador**: `admin@patitas.com`
- **Veterinario**: `vet@patitas.com`
- **Cliente**: `cliente@patitas.com`

---

## ✅ Autor
- **Jenifer Cruz** - TP Final Backend UTN 2026.
