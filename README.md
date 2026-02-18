# tp-patitas-felices
# 🐾 Proyecto Veterinaria Patitas Felices

Backend para la gestión de una clínica veterinaria. Incluye autenticación de usuarios y gestión de reservas (turnos).

## 🚀 Feats Implementados
- **Feat 5:** Lógica de Negocio 1:N (Usuarios <-> Reservas). Protección de recursos.
- **Feat 6:** Robustez (Manejo de errores centralizado y CORS).

## 🛠️ Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone <repo_url>
    cd tp-patitas-felices
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    - Copia el archivo de ejemplo: `cp .env.example .env`
    - Edita `.env` con tus credenciales de MySQL.

4.  **Base de Datos:**
    - Importa el archivo `dump.sql` en tu gestor de MySQL (Workbench/DBeaver).

5.  **Ejecutar:**
    - Desarrollo: `npm run dev`
    - Producción: `npm run build && npm start`

## 🔗 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Crear cuenta.
- `POST /api/auth/login` - Iniciar sesión.

### Dueños
- `GET /api/duenos` - Listar dueños (Requiere Token).
- `POST /api/duenos` - Crear dueño (Requiere Token).
- `PUT /api/duenos/:id` - Actualizar dueño (Requiere Token).
- `DELETE /api/duenos/:id` - Eliminar dueño (Requiere Token).

### Mascotas
- `GET /api/mascotas` - Listar mascotas (Requiere Token).
- `POST /api/mascotas` - Crear mascota (Requiere Token).
- `PUT /api/mascotas/:id` - Actualizar mascota (Requiere Token).
- `DELETE /api/mascotas/:id` - Eliminar mascota (Requiere Token).

### Turnos
- `GET /api/turnos` - Ver turnos (Requiere Token).
- `POST /api/turnos` - Solicitar turno (Requiere Token).
- `PUT /api/turnos/:id` - Actualizar turno (Requiere Token).
- `DELETE /api/turnos/:id` - Cancelar turno (Requiere Token).

### Historial Médico
- `GET /api/historial` - Listar historiales (Requiere Token).
- `POST /api/historial` - Crear historial (Requiere Token).
- `PUT /api/historial/:id` - Actualizar historial (Requiere Token).
- `DELETE /api/historial/:id` - Eliminar historial (Requiere Token).

### Veterinarios
- `GET /api/veterinarios` - Listar veterinarios (Requiere Token).
- `GET /api/veterinarios/agenda` - Ver agenda del día (Requiere Token).
- `GET /api/veterinarios/historial-reciente` - Historial reciente (Requiere Token).

### Servicios
- `GET /api/servicios` - Listar servicios disponibles (Requiere Token).