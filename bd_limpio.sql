-- BASE DE DATOS - VETERINARIA PATITAS FELICES
-- Eliminar y crear base de datos
DROP DATABASE IF EXISTS veterinaria_patitas_felices;
CREATE DATABASE veterinaria_patitas_felices;
USE veterinaria_patitas_felices;

-- 1. TABLA: usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'veterinario', 'cliente') DEFAULT 'cliente',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA: duenos
CREATE TABLE duenos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. TABLA: mascotas
CREATE TABLE mascotas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(30) NOT NULL,
    raza VARCHAR(50),
    fecha_nacimiento DATE,
    advertencias TEXT,
    dueno_id INT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dueno_id) REFERENCES duenos(id) ON DELETE CASCADE
);

-- 4. TABLA: veterinarios
CREATE TABLE veterinarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 5. TABLA: servicios
CREATE TABLE servicios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    duracion_minutos INT DEFAULT 60
);

-- 6. TABLA: turnos
CREATE TABLE turnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    servicio_id INT NOT NULL,
    veterinario_id INT,
    fecha_hora DATETIME NOT NULL,
    motivo VARCHAR(200) NOT NULL,
    estado ENUM('pendiente', 'confirmado', 'completado', 'cancelado') DEFAULT 'pendiente',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id)
);


-- 8. TABLA: historial_medico
CREATE TABLE historial_medico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    fecha DATETIME NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id)
);

-- DATOS DE PRUEBA SIMPLES
-- Usuarios
INSERT INTO usuarios (email, password, rol) VALUES
('juan@mail.com', 'hash123', 'cliente'),
('maria@mail.com', 'hash456', 'cliente'),
('vet@clinica.com', 'hash789', 'veterinario'),
('admin@clinica.com', 'hash000', 'admin');

-- Dueños
INSERT INTO duenos (usuario_id, nombre, apellido, telefono) VALUES
(1, 'Juan', 'Pérez', '11-1111-1111'),
(2, 'María', 'Gómez', '22-2222-2222');

-- Veterinarios
INSERT INTO veterinarios (usuario_id, nombre, apellido, matricula) VALUES
(3, 'Carlos', 'López', 'MV-001');

-- Mascotas
INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, advertencias, dueno_id) VALUES
('Rex', 'Perro', 'Labrador', '2020-05-15', 'Alergia a la penicilina', 1),
('Mishi', 'Gato', 'Siamés', '2021-03-10', 'Ninguna', 2),
('Luna', 'Perro', 'Caniche', '2019-11-20', 'No dar antiinflamatorios', 1);

-- Servicios
INSERT INTO servicios (nombre, duracion_minutos) VALUES
('Consulta general', 60),
('Vacunación', 60),
('Desparasitación', 60);

-- Turnos
INSERT INTO turnos (mascota_id, servicio_id, veterinario_id, fecha_hora, motivo, estado) VALUES
(1, 1, 1, '2024-03-25 10:00:00', 'Control anual', 'confirmado'),
(2, 2, 1, '2024-03-26 11:00:00', 'Vacuna antirrábica', 'pendiente'),
(3, 1, 1, '2024-03-27 09:00:00', 'Revisión de rutina', 'confirmado');

-- Historial médico
INSERT INTO historial_medico (mascota_id, veterinario_id, fecha, diagnostico, tratamiento) VALUES
(1, 1, '2024-01-15 14:30:00', 'Saludable, peso normal', 'Continuar alimentación actual'),
(2, 1, '2024-02-10 16:00:00', 'Necesita vacunación', 'Agendar para próximo mes'),
(1, 1, '2023-12-05 10:30:00', 'Dermatitis leve', 'Crema especial por 7 días');




CREATE TABLE historiales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE
);


ALTER TABLE turnos MODIFY COLUMN estado ENUM('pendiente', 'confirmado', 'completado', 'cancelado', 'realizado') DEFAULT 'pendiente';


INSERT INTO historiales (mascota_id, veterinario_id, fecha, diagnostico, tratamiento)
SELECT mascota_id, veterinario_id, fecha, diagnostico, tratamiento 
FROM historial_medico;