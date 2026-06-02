-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 02, 2026 at 04:14 PM
-- Server version: 12.2.2-MariaDB
-- PHP Version: 8.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heartware`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
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
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id_order`, `id_user`, `payment_method`, `state`, `date`, `price`, `customer_name`, `street`, `city`, `state_address`, `postal_code`, `country`) VALUES
(4, 2, 'Digital wallet', 'accepted', '2026-06-02 05:37:27', 1201, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(5, 2, 'Digital wallet', 'accepted', '2026-06-02 05:56:13', 4798, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(6, 2, 'Digital wallet', 'accepted', '2026-06-02 06:31:57', 7203, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(7, 2, 'Digital wallet', 'accepted', '2026-06-02 07:01:30', 4802, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(8, 2, 'Digital wallet', 'accepted', '2026-06-02 07:25:35', 6003, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(11, 5, 'Digital wallet', 'accepted', '2026-06-02 15:47:22', 12, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX'),
(12, 8, 'Digital wallet', 'accepted', '2026-06-02 16:02:44', 1201, 'John Doe', 'Calle Juarez 1', 'Miguel Hidalgo', 'CIUDAD DE MEXICO', '11580', 'MX');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(512) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0 CHECK (`quantity` >= 0),
  `description` text DEFAULT NULL,
  `inventory_status` enum('INSTOCK','LOWSTOCK','OUTOFSTOCK') DEFAULT 'INSTOCK',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image`, `category`, `quantity`, `description`, `inventory_status`, `created_at`) VALUES
(1, 'LoveBox', 1200.50, 'lovebox-1.webp', 'Decoración', 3, 'Caja que recibe mensajes de manera remota de una menra coqueta e inmediata', 'LOWSTOCK', '2026-03-27 02:12:13'),
(2, 'LuvLink - Classic', 1400.50, 'luvlink1.webp', 'Iluminación', 18, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista', 'INSTOCK', '2026-03-27 02:13:23'),
(3, 'Touch Bond', 199.50, 'bond_touch1.webp', 'Accesorio', 32, 'Pulsera que manda señales y pulsos cuanto tu pareja las emite', 'INSTOCK', '2026-03-27 03:21:40'),
(4, 'LuvLink - Heart', 99.50, 'luvlink_heart.webp', 'Iluminación', 12, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista forma de corazón con vista al ESP32', 'INSTOCK', '2026-03-27 03:21:40'),
(5, 'LuvLink - Circle', 1499.50, 'luvlink_circle.webp', 'Iluminación', 0, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista forma de loop circular', 'OUTOFSTOCK', '2026-03-27 03:21:40');

--
-- Triggers `products`
--
DELIMITER $$
CREATE TRIGGER `actualiza_estado_inventario` BEFORE UPDATE ON `products` FOR EACH ROW BEGIN
    -- Evaluamos el nuevo valor de cantidad (NEW.quantity) que se va a guardar
    IF NEW.quantity <= 0 THEN
        SET NEW.inventory_status = 'OUTOFSTOCK';
    ELSEIF NEW.quantity < 5 THEN
        SET NEW.inventory_status = 'LOWSTOCK';
    ELSE
        SET NEW.inventory_status = 'INSTOCK';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `products_orders`
--

CREATE TABLE `products_orders` (
  `id_product_order` bigint(20) NOT NULL,
  `id_order` bigint(20) UNSIGNED NOT NULL,
  `id_product` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products_orders`
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
(31, 8, 1),
(34, 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `name`, `last_name`, `email`, `password`, `type`) VALUES
(2, 'Adrián Kosey', 'Angeles Ramos', 'adrian.kosey2@gmail.com', '$2b$10$/xzuglMuu46pizlCBIO2ReesCXE/Fyy9CgLiWAkgknolVDoPZygly', 'admin'),
(3, 'Juanito', 'Perez', 'juanito@email.com', '$2b$10$FgWabgB/LzwAV/nRIdC8aOrl28EyrhVzLYSs8oqz6Zh.QlP3NnWOG', 'user'),
(5, 'Adro', 'Ornelas', 'adotal1484@gmail.com', '$2b$10$1rh/7AhvOBw52EWlldPQNO89Q2qnOWtPeUiZNnaI9RraNqN8MB63W', 'user'),
(6, 'Admin', 'Admin', 'admin@gmail.com', '$2b$10$fGcisHsNiMyi5r6xtaS6TuHkBorFI6x1kk/BDsdfz6D1nqA.9SNCm', 'admin'),
(8, 'Adrian', 'Vivanco', 'a@gmail.com', '$2b$10$1/0by86ofLT5OvXnQEVmoOK3M8sTBamt6HRec9QtnfMapBF7AqtjC', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `fk_cus_user` (`id_user`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products_orders`
--
ALTER TABLE `products_orders`
  ADD PRIMARY KEY (`id_product_order`),
  ADD KEY `fk_order_product` (`id_product`),
  ADD KEY `fk_product_order` (`id_order`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id_order` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `products_orders`
--
ALTER TABLE `products_orders`
  MODIFY `id_product_order` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_cus_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `products_orders`
--
ALTER TABLE `products_orders`
  ADD CONSTRAINT `fk_order_product` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_product_order` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id_order`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
