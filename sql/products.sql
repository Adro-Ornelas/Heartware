-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2026 a las 11:58:14
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
-- Base de datos: `heartware`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id_order` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED DEFAULT NULL,
  `payment_method` enum('Credit card','Debit card','Digital wallet','SPEI') NOT NULL,
  `state` enum('accepted','rejected','cancelled','error') NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` int(11) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state_address` varchar(255) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id_order`, `id_user`, `payment_method`, `state`, `date`, `price`, `customer_name`, `street`, `city`, `state_address`, `postal_code`, `country`) VALUES
(4, 2, 'Digital wallet', 'accepted', '2026-06-02 05:37:27', 1201, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(5, 2, 'Digital wallet', 'accepted', '2026-06-02 05:56:13', 4798, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(6, 2, 'Digital wallet', 'accepted', '2026-06-02 06:31:57', 7203, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(7, 2, 'Digital wallet', 'accepted', '2026-06-02 07:01:30', 4802, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(8, 2, 'Digital wallet', 'accepted', '2026-06-02 07:25:35', 6003, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(512) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0 CHECK (`quantity` >= 0),
  `description` text DEFAULT NULL,
  `inventoryStatus` enum('INSTOCK','LOWSTOCK','OUTOFSTOCK') DEFAULT 'INSTOCK',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image`, `category`, `quantity`, `description`, `inventoryStatus`, `created_at`) VALUES
(1, 'LoveBox', 1200.50, 'lovebox-1.webp', 'Decoración', 4, 'Caja que recibe mensajes de manera remota de una menra coqueta e inmediata', 'LOWSTOCK', '2026-03-27 02:12:13'),
(2, 'LuvLink - Classic', 1400.50, 'luvlink1.webp', 'Iluminación', 18, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista', 'INSTOCK', '2026-03-27 02:13:23'),
(3, 'Touch Bond', 199.50, 'bond_touch1.webp', 'Accesorio', 32, 'Pulsera que manda señales y pulsos cuanto tu pareja las emite', 'INSTOCK', '2026-03-27 03:21:40'),
(4, 'LuvLink - Heart', 99.50, 'luvlink_heart.webp', 'Iluminación', 12, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista forma de corazón con vista al ESP32', 'INSTOCK', '2026-03-27 03:21:40'),
(5, 'LuvLink - Circle', 1499.50, 'luvlink_circle.webp', 'Iluminación', 0, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista forma de loop circular', 'OUTOFSTOCK', '2026-03-27 03:21:40');

--
-- Disparadores `products`
--
DELIMITER $$
CREATE TRIGGER `actualiza_estado_inventario` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
    -- Evaluamos el nuevo valor de cantidad (NEW.quantity) que se va a guardar
    IF NEW.quantity <= 0 THEN
        SET NEW.inventoryStatus = 'OUTOFSTOCK';
    ELSEIF NEW.quantity < 5 THEN
        SET NEW.inventoryStatus = 'LOWSTOCK';
    ELSE
        SET NEW.inventoryStatus = 'INSTOCK';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products_orders`
--

CREATE TABLE `products_orders` (
  `id_product_order` bigint(20) NOT NULL,
  `id_order` bigint(20) UNSIGNED NOT NULL,
  `id_product` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products_orders`
--

INSERT INTO `products_orders` (`id_product_order`, `id_order`, `id_product`) VALUES
(7, 4, 1),
(8, 5, 1),
(9, 5, 2),
(10, 5, 3),
(11, 5, 5),
(12, 5, 4),
(13, 5, 4),
(14, 5, 4),
(15, 5, 4),
(16, 5, 4),
(17, 6, 1),
(18, 6, 1),
(19, 6, 1),
(20, 6, 1),
(21, 6, 1),
(22, 6, 1),
(23, 7, 1),
(24, 7, 1),
(25, 7, 1),
(26, 7, 1),
(27, 8, 1),
(28, 8, 1),
(29, 8, 1),
(30, 8, 1),
(31, 8, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_user`, `name`, `last_name`, `email`, `password`, `type`) VALUES
(2, 'Adrián Kosey', 'Angeles Ramos', 'adrian.kosey2@gmail.com', '$2b$10$/xzuglMuu46pizlCBIO2ReesCXE/Fyy9CgLiWAkgknolVDoPZygly', 'admin'),
(3, 'Juanito', 'Perez', 'juanito@email.com', '$2b$10$FgWabgB/LzwAV/nRIdC8aOrl28EyrhVzLYSs8oqz6Zh.QlP3NnWOG', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `fk_cus_user` (`id_user`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `products_orders`
--
ALTER TABLE `products_orders`
  ADD PRIMARY KEY (`id_product_order`),
  ADD KEY `fk_order_product` (`id_product`),
  ADD KEY `fk_product_order` (`id_order`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id_order` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `products_orders`
--
ALTER TABLE `products_orders`
  MODIFY `id_product_order` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_cus_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Filtros para la tabla `products_orders`
--
ALTER TABLE `products_orders`
  ADD CONSTRAINT `fk_order_product` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_product_order` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id_order`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
