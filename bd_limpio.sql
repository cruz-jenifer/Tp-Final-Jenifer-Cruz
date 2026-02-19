-- 1. TABLAS DE CATÁLOGO (LOOKUP)

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE especies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE razas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    especie_id INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    CONSTRAINT fk_razas_especie FOREIGN KEY (especie_id) REFERENCES especies(id) ON DELETE RESTRICT
);

CREATE TABLE tipos_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. SISTEMA DE USUARIOS (JERARQUÍA DE GENERALIZACIÓN)

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    CONSTRAINT fk_veterinarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE duenos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    dni VARCHAR(15) UNIQUE,
    CONSTRAINT fk_duenos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. ENTIDADES DE NEGOCIO (DATOS VIVOS)

CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dueno_id INT NOT NULL,
    raza_id INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mascotas_dueno FOREIGN KEY (dueno_id) REFERENCES duenos(id) ON DELETE CASCADE,
    CONSTRAINT fk_mascotas_raza FOREIGN KEY (raza_id) REFERENCES razas(id) ON DELETE RESTRICT
    -- CONSTRAINT chk_mascota_nacimiento CHECK (fecha_nacimiento <= CURDATE())
);

CREATE TABLE turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    servicio_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo_consulta TEXT NOT NULL,
    estado ENUM('pendiente', 'confirmado', 'cancelado', 'completado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_turnos_mascota FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    CONSTRAINT fk_turnos_vet FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_turnos_servicio FOREIGN KEY (servicio_id) REFERENCES tipos_servicios(id) ON DELETE RESTRICT,
    -- CONSTRAINT chk_turno_fecha CHECK (fecha >= CURDATE()),
    CONSTRAINT uq_agenda_veterinario UNIQUE (veterinario_id, fecha, hora)
);

-- 4. DATOS HISTÓRICOS

CREATE TABLE historial_medico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historial_mascota FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    CONSTRAINT fk_historial_vet FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE RESTRICT
    -- CONSTRAINT chk_historial_fecha CHECK (fecha <= CURDATE())
);