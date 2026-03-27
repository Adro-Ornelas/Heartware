-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 27, 2026 at 03:24 AM
-- Server version: 12.2.2-MariaDB
-- PHP Version: 8.5.4

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
  `inventoryStatus` enum('INSTOCK','LOWSTOCK','OUTOFSTOCK') DEFAULT 'INSTOCK',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image`, `category`, `quantity`, `description`, `inventoryStatus`, `created_at`) VALUES
(1, 'LoveBox', 1200.50, 'lovebox-1.webp', 'Decoración', 10, 'Caja que recibe mensajes de manera remota de una menra coqueta e inmediata', 'INSTOCK', '2026-03-27 02:12:13'),
(2, 'LuvLink - Classic', 1400.50, 'luvlink1.webp', 'Iluminación', 100, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista', 'LOWSTOCK', '2026-03-27 02:13:23'),
(3, 'Touch Bond', 199.50, 'bond_touch1.webp', 'Accesorio', 102, 'Pulsera que manda señales y pulsos cuanto tu pareja las emite', 'INSTOCK', '2026-03-27 03:21:40'),
(4, 'LuvLink - Heart', 99.50, 'luvlink_heart.webp', 'Iluminación', 102, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista forma de corazón con vista al ESP32', 'INSTOCK', '2026-03-27 03:21:40'),
(5, 'LuvLink - Circle', 1499.50, 'luvlink_circle.webp', 'Iluminación', 102, 'Lámpara que cambia de color cuando uno de las personas en los extremos la toca, estilo minimalista forma de loop circular', 'OUTOFSTOCK', '2026-03-27 03:21:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
