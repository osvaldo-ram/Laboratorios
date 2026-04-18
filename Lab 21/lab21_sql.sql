-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-04-2026 a las 05:08:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lab21_sql`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entregan`
--

CREATE TABLE `entregan` (
  `clave` int(11) NOT NULL,
  `rfc` varchar(13) NOT NULL,
  `numero` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `entregan`
--

INSERT INTO `entregan` (`clave`, `rfc`, `numero`, `fecha`, `cantidad`) VALUES
(1001, 'ACME800101', 5001, '2000-01-15', 550),
(1001, 'LATA770707', 5001, '2000-07-14', 800),
(1001, 'OBRA900303', 5004, '2001-10-05', 220),
(1001, 'VAGO780901', 5001, '1997-02-10', 300),
(1001, 'VAGO780901', 5004, '2000-01-20', 200),
(1001, 'VAGO780901', 5004, '2001-03-09', 400),
(1002, 'ACME800101', 5002, '2000-02-10', 620),
(1002, 'LATA770707', 5002, '2001-08-08', 100),
(1002, 'OBRA900303', 5003, '2000-12-01', 710),
(1002, 'QROL850505', 5002, '2000-03-05', 350),
(1002, 'VAGO780901', 5001, '1997-03-15', 250),
(1002, 'VAGO780901', 5002, '2001-04-19', 350),
(1003, 'ACME800101', 5001, '2000-10-10', 580),
(1003, 'ACME800101', 5002, '1997-04-20', 600),
(1003, 'ACME800101', 5002, '2000-10-20', 590),
(1003, 'OBRA900303', 5003, '2000-05-10', 700),
(1003, 'OBRA900303', 5005, '2001-07-01', 500),
(1003, 'VAGO780901', 5006, '2000-02-11', 300),
(1004, 'ACME800101', 5002, '1997-05-05', 700),
(1004, 'ACME800101', 5004, '2000-03-12', 500),
(1004, 'ACME800101', 5004, '2001-01-10', 150),
(1004, 'LATA770707', 5002, '2000-08-18', 900),
(1005, 'ACME800101', 5004, '2000-04-01', 400),
(1005, 'ACME800101', 5006, '2001-02-14', 100),
(1005, 'LATA770707', 5001, '2000-11-21', 870),
(1005, 'QROL850505', 5003, '1997-06-01', 450),
(1006, 'LATA770707', 5004, '2000-09-03', 750),
(1006, 'LATA770707', 5004, '2001-09-17', 120),
(1006, 'OBRA900303', 5004, '1997-07-18', 520),
(1006, 'QROL850505', 5003, '2000-03-25', 450),
(1006, 'QROL850505', 5003, '2001-05-12', 300),
(1007, 'LATA770707', 5002, '2000-11-11', 910),
(1007, 'LATA770707', 5005, '1997-08-09', 480),
(1007, 'QROL850505', 5001, '2001-06-20', 280),
(1007, 'QROL850505', 5006, '2000-04-15', 520),
(1008, 'OBRA900303', 5004, '2000-06-22', 650),
(1008, 'OBRA900303', 5004, '2001-07-15', 200);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiales`
--

CREATE TABLE `materiales` (
  `clave` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `porcentaje_impuesto` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `materiales`
--

INSERT INTO `materiales` (`clave`, `descripcion`, `costo`, `porcentaje_impuesto`) VALUES
(1001, 'Cemento', 120.00, 16.00),
(1002, 'Arena', 80.00, 16.00),
(1003, 'Grava', 95.00, 16.00),
(1004, 'Varilla', 210.00, 16.00),
(1005, 'Pintura Blanca', 150.00, 16.00),
(1006, 'Ladrillo', 12.00, 16.00),
(1007, 'Tuberia PVC', 75.00, 16.00),
(1008, 'Cable Electrico', 55.00, 16.00),
(1009, 'Azulejo', 65.00, 16.00),
(1010, 'Impermeabilizante', 180.00, 16.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `rfc` varchar(13) NOT NULL,
  `razon_social` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`rfc`, `razon_social`) VALUES
('ACME800101', 'Acme Tools'),
('LATA770707', 'La Tarasca Industrial'),
('OBRA900303', 'Obras del Centro'),
('QROL850505', 'Queretaro Suministros'),
('VAGO780901', 'Vagones del Golfo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `numero` int(11) NOT NULL,
  `denominacion` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`numero`, `denominacion`) VALUES
(5001, 'Vamos México'),
(5002, 'Querétaro Limpio'),
(5003, 'CIT Yucatán'),
(5004, 'Infonavit Durango'),
(5005, 'Rescate Urbano'),
(5006, 'Parque Industrial Bajío');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `entregan`
--
ALTER TABLE `entregan`
  ADD PRIMARY KEY (`clave`,`rfc`,`numero`,`fecha`),
  ADD KEY `fk_entregan_proveedor` (`rfc`),
  ADD KEY `fk_entregan_proyecto` (`numero`);

--
-- Indices de la tabla `materiales`
--
ALTER TABLE `materiales`
  ADD PRIMARY KEY (`clave`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`rfc`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`numero`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entregan`
--
ALTER TABLE `entregan`
  ADD CONSTRAINT `fk_entregan_material` FOREIGN KEY (`clave`) REFERENCES `materiales` (`clave`),
  ADD CONSTRAINT `fk_entregan_proveedor` FOREIGN KEY (`rfc`) REFERENCES `proveedores` (`rfc`),
  ADD CONSTRAINT `fk_entregan_proyecto` FOREIGN KEY (`numero`) REFERENCES `proyectos` (`numero`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
