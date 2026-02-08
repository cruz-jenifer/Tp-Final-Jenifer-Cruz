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

- `POST /api/auth/register` - Crear cuenta.
- `POST /api/auth/login` - Iniciar sesión.
- `GET /api/reservas` - Ver mis turnos (Requiere Token).
- `POST /api/reservas` - Solicitar turno (Requiere Token).
- `DELETE /api/reservas/:id` - Cancelar mi turno (Requiere Token).