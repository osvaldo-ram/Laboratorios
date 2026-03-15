-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-03-2026 a las 03:40:50
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
-- Base de datos: `laboratorio15`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entregan`
--

CREATE TABLE `entregan` (
  `Clave` int(11) NOT NULL,
  `RFC` varchar(13) NOT NULL,
  `Numero` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiales`
--

CREATE TABLE `materiales` (
  `Clave` int(11) NOT NULL,
  `Descripcion` varchar(100) DEFAULT NULL,
  `Costo` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `RFC` varchar(13) NOT NULL,
  `RazonSocial` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `Numero` int(11) NOT NULL,
  `Denominacion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `entregan`
--
ALTER TABLE `entregan`
  ADD PRIMARY KEY (`Clave`,`RFC`,`Numero`,`Fecha`),
  ADD KEY `RFC` (`RFC`),
  ADD KEY `Numero` (`Numero`);

--
-- Indices de la tabla `materiales`
--
ALTER TABLE `materiales`
  ADD PRIMARY KEY (`Clave`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`RFC`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`Numero`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entregan`
--
ALTER TABLE `entregan`
  ADD CONSTRAINT `entregan_ibfk_1` FOREIGN KEY (`Clave`) REFERENCES `materiales` (`Clave`),
  ADD CONSTRAINT `entregan_ibfk_2` FOREIGN KEY (`RFC`) REFERENCES `proveedores` (`RFC`),
  ADD CONSTRAINT `entregan_ibfk_3` FOREIGN KEY (`Numero`) REFERENCES `proyectos` (`Numero`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
