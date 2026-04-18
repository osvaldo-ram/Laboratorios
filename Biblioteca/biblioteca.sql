-- Base de datos: biblioteca
-- Laboratorio RBAC + resenas
-- Este script reinicia la base completa para evitar conflictos
-- con llaves foraneas de importaciones anteriores.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS `biblioteca`;
CREATE DATABASE `biblioteca` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `biblioteca`;

DROP TABLE IF EXISTS `resenas`;
DROP TABLE IF EXISTS `roles_permisos`;
DROP TABLE IF EXISTS `usuarios_roles`;
DROP TABLE IF EXISTS `permisos`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `libros`;
DROP TABLE IF EXISTS `usuarios`;

SET FOREIGN_KEY_CHECKS = 1;

START TRANSACTION;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_nombre_unique` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `permisos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clave` varchar(80) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permisos_clave_unique` (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios_roles` (
  `usuario_id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL,
  PRIMARY KEY (`usuario_id`, `rol_id`),
  KEY `usuarios_roles_rol_id_idx` (`rol_id`),
  CONSTRAINT `usuarios_roles_usuario_fk`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuarios_roles_rol_fk`
    FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `roles_permisos` (
  `rol_id` int(11) NOT NULL,
  `permiso_id` int(11) NOT NULL,
  PRIMARY KEY (`rol_id`, `permiso_id`),
  KEY `roles_permisos_permiso_id_idx` (`permiso_id`),
  CONSTRAINT `roles_permisos_rol_fk`
    FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roles_permisos_permiso_fk`
    FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `libros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(255) NOT NULL,
  `genero` varchar(100) DEFAULT NULL,
  `anio` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `resenas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `libro_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `calificacion` tinyint unsigned NOT NULL,
  `comentario` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `resenas_libro_usuario_unique` (`libro_id`, `usuario_id`),
  KEY `resenas_usuario_id_idx` (`usuario_id`),
  CONSTRAINT `resenas_libro_fk`
    FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_usuario_fk`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_calificacion_check` CHECK (`calificacion` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'administrador', 'Administra libros, resenas y permisos del sistema'),
(2, 'usuario', 'Consulta libros y registra resenas');

INSERT INTO `permisos` (`id`, `clave`, `descripcion`) VALUES
(1, 'libros:read', 'Ver listado y detalle de libros'),
(2, 'libros:create', 'Agregar libros'),
(3, 'libros:update', 'Editar libros'),
(4, 'libros:delete', 'Eliminar libros'),
(5, 'resenas:create', 'Crear o actualizar resenas propias'),
(6, 'resenas:delete', 'Eliminar resenas de cualquier usuario');

INSERT INTO `roles_permisos` (`rol_id`, `permiso_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 1),
(2, 5);

-- Passwords de prueba:
-- admin / admin123
-- lector / usuario123
INSERT INTO `usuarios` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2b$12$TlSV2IfktbzaSmeuy5KIh.vgu4ao8MftDWhgVFKtHTCSs7/3OMiEm', '2026-04-17 18:00:00'),
(2, 'lector', '$2b$12$7WEJogfTt2Bo3rTT4fNeoums9ceGOfAFaHGm1PRkbyqpKSoPBAE9C', '2026-04-17 18:05:00');

INSERT INTO `usuarios_roles` (`usuario_id`, `rol_id`) VALUES
(1, 1),
(2, 2);

INSERT INTO `libros` (`id`, `titulo`, `autor`, `genero`, `anio`, `created_at`) VALUES
(1, 'Cien anos de Soledad', 'Gabriel Garcia Marquez', 'Realismo magico', 1967, '2026-04-07 18:19:37'),
(2, '1984', 'George Orwell', 'Distopia', 1949, '2026-04-07 18:19:37'),
(3, 'El Principito', 'Antoine de Saint-Exupery', 'Fabula', 1943, '2026-04-07 18:19:37'),
(4, 'Don Quijote de la Mancha', 'Miguel de Cervantes', 'Novela', 1605, '2026-04-07 18:19:37'),
(5, 'Fahrenheit 451', 'Ray Bradbury', 'Ciencia ficcion', 1953, '2026-04-17 18:20:00'),
(6, 'La sombra del viento', 'Carlos Ruiz Zafon', 'Misterio', 2001, '2026-04-17 18:25:00');

INSERT INTO `resenas` (`id`, `libro_id`, `usuario_id`, `calificacion`, `comentario`, `created_at`) VALUES
(1, 1, 2, 5, 'Una novela excelente para discutir narrativa latinoamericana.', '2026-04-17 18:30:00'),
(2, 2, 2, 4, 'La historia sigue siendo muy actual y facil de debatir en clase.', '2026-04-17 18:35:00'),
(3, 3, 1, 5, 'Lectura corta con mucho valor para recomendar.', '2026-04-17 18:40:00'),
(4, 5, 2, 4, 'Buen ejemplo de distopia y control social.', '2026-04-17 18:45:00');

ALTER TABLE `usuarios` AUTO_INCREMENT = 3;
ALTER TABLE `roles` AUTO_INCREMENT = 3;
ALTER TABLE `permisos` AUTO_INCREMENT = 7;
ALTER TABLE `libros` AUTO_INCREMENT = 7;
ALTER TABLE `resenas` AUTO_INCREMENT = 5;

COMMIT;
