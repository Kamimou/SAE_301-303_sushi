-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 10 déc. 2025 à 23:49
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sae_sushi`
--

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(160) NOT NULL,
  `message` text NOT NULL,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `ref` varchar(32) NOT NULL,
  `customer_name` varchar(120) NOT NULL,
  `total` decimal(8,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `pieces` int(11) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image_key` varchar(100) NOT NULL,
  `is_available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `pieces`, `price`, `description`, `image_key`, `is_available`) VALUES
(1, 'Tasty Blend', 12, 12.50, 'Description du Tasty Blend', 'tasty-blend', 1),
(2, 'Amateur Mix', 18, 15.90, 'Description de l\'Amateur Mix', 'amateur-mix', 1),
(3, 'Saumon Original', 11, 12.50, 'Description du Saumon Original', 'saumon-original', 1),
(4, 'Salmon Lovers', 18, 15.90, 'Description du Salmon Lovers', 'salmon-lovers', 1),
(5, 'Salmon Classic', 10, 15.90, 'Description du Salmon Classic', 'salmon-classic', 1),
(6, 'Master Mix', 12, 15.90, 'Description du Master Mix', 'master-mix', 1),
(7, 'Sunrise', 18, 15.90, 'Description du Sunrise', 'sunrise', 1),
(8, 'Sando Box Chicken Katsu', 13, 15.90, 'Description du Sando Box Chicken Katsu', 'sando-box-chicken-katsu', 1),
(9, 'Sando Box Salmon Aburi', 13, 15.90, 'Description du Sando Box Salmon Aburi', 'sando-box-salmon-aburi', 1),
(10, 'Super Salmon', 24, 19.90, 'Description du Super Salmon', 'super-salmon', 1),
(11, 'California Dream', 24, 19.90, 'Description du California Dream', 'california-dream', 1),
(12, 'Gourmet Mix', 22, 24.50, 'Description du Gourmet Mix', 'gourmet-mix', 1),
(13, 'Fresh Mix', 22, 24.50, 'Description du Fresh Mix', 'fresh-mix', 1);

-- --------------------------------------------------------

--
-- Structure de la table `product_flavors`
--

DROP TABLE IF EXISTS `product_flavors`;
CREATE TABLE `product_flavors` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `flavor` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product_flavors`
--

INSERT INTO `product_flavors` (`id`, `product_id`, `flavor`) VALUES
(1, 1, 'saumon'),
(2, 1, 'avocat'),
(3, 1, 'cheese'),
(4, 2, 'coriandre'),
(5, 2, 'saumon'),
(6, 2, 'avocat'),
(7, 2, 'cheese'),
(8, 3, 'saumon'),
(9, 3, 'avocat'),
(10, 4, 'coriandre'),
(11, 4, 'saumon'),
(12, 4, 'avocat'),
(13, 5, 'saumon'),
(14, 6, 'saumon'),
(15, 6, 'thon'),
(16, 6, 'avocat'),
(17, 7, 'saumon'),
(18, 7, 'thon'),
(19, 7, 'avocat'),
(20, 7, 'cheese'),
(21, 8, 'saumon'),
(22, 8, 'viande'),
(23, 8, 'avocat'),
(24, 8, 'cheese'),
(25, 9, 'saumon'),
(26, 9, 'thon'),
(27, 9, 'avocat'),
(28, 10, 'coriandre'),
(29, 10, 'saumon'),
(30, 10, 'avocat'),
(31, 10, 'cheese'),
(32, 11, 'spicy'),
(33, 11, 'saumon'),
(34, 11, 'thon'),
(35, 11, 'crevette'),
(36, 11, 'viande'),
(37, 11, 'avocat'),
(38, 12, 'coriande'),
(39, 12, 'spicy'),
(40, 12, 'saumon'),
(41, 12, 'viande'),
(42, 12, 'avocat'),
(43, 12, 'seriole lalandi'),
(44, 13, 'spicy'),
(45, 13, 'saumon'),
(46, 13, 'thon'),
(47, 13, 'avocat'),
(48, 13, 'cheese');

-- --------------------------------------------------------

--
-- Structure de la table `product_items`
--

DROP TABLE IF EXISTS `product_items`;
CREATE TABLE `product_items` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `quantity` decimal(4,1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product_items`
--

INSERT INTO `product_items` (`id`, `product_id`, `item_name`, `quantity`) VALUES
(1, 1, 'California Saumon Avocat', 3.0),
(2, 1, 'Sushi Saumon', 3.0),
(3, 1, 'Spring Avocat Cheese', 3.0),
(4, 1, 'California pacific', 3.0),
(5, 1, 'Edamame/Salade de chou', 1.0),
(6, 2, 'Maki Salmon Roll', 3.0),
(7, 2, 'Spring Saumon Avocat', 3.0),
(8, 2, 'Maki Cheese Avocat', 6.0),
(9, 2, 'California Saumon Avocat', 3.0),
(10, 2, 'Edamame/Salade de chou', 1.0),
(11, 3, 'California Saumon Avocat', 6.0),
(12, 3, 'Sushi Saumon', 5.0),
(13, 3, 'Edamame/Salade de chou', 1.0),
(14, 4, 'California Saumon Avocat', 6.0),
(15, 4, 'Spring Saumon Avocat', 6.0),
(16, 4, 'Sushi Saumon', 6.0),
(17, 4, 'Edamame/Salade de chou', 1.0),
(18, 5, 'Sushi Saumon', 10.0),
(19, 5, 'Edamame/Salade de chou', 1.0),
(20, 6, 'Sushi Saumon', 4.0),
(21, 6, 'Sushi Thon', 2.0),
(22, 6, 'California Thon Avocat', 3.0),
(23, 6, 'California Saumon Avocat', 3.0),
(24, 6, 'Edamame / Salade de chou', 1.0),
(25, 7, 'Maki Salmon Roll', 6.0),
(26, 7, 'California Saumon Avocat', 6.0),
(27, 7, 'California Thon Cuit Avocat', 6.0),
(28, 7, 'Edamame / Salade de chou', 1.0),
(29, 8, 'Sando Chicken Katsu', 0.5),
(30, 8, 'Maki Salmon Roll', 6.0),
(31, 8, 'California Saumon Avocat', 6.0),
(32, 8, 'California Thon Cuit Avocat', 6.0),
(33, 8, 'Edamame / Salade de chou', 1.0),
(34, 9, 'Sando Salmon Aburi', 0.5),
(35, 9, 'California Saumon Avocat', 6.0),
(36, 9, 'California Thon Cuit Avocat', 6.0),
(37, 9, 'Edamame / Salade de chou', 1.0),
(38, 10, 'California Saumon Avocat', 6.0),
(39, 10, 'Maki Salmon Roll', 6.0),
(40, 10, 'Maki Salmon', 6.0),
(41, 10, 'Spring Saumon Avocat', 6.0),
(42, 10, 'Edamame / Salade de chou', 1.0),
(43, 11, 'California Saumon Avocat', 6.0),
(44, 11, 'California Crevette', 6.0),
(45, 11, 'California Thon Cuit Avocat', 6.0),
(46, 11, 'California Chicken Katsu', 6.0),
(47, 11, 'Edamame / Salade de chou', 1.0),
(48, 12, 'Spring tataki Saumon', 6.0),
(49, 12, 'Signature Dragon Roll', 4.0),
(50, 12, 'California French Touch', 3.0),
(51, 12, 'California French salmon', 6.0),
(52, 12, 'California Yellowtail Ponzu', 3.0),
(53, 12, 'Edamame / Salade de chou', 1.0),
(54, 13, 'Signature Rock\'n Roll', 4.0),
(55, 13, 'Maki Salmon Roll', 6.0),
(56, 13, 'California Pacific', 6.0),
(57, 13, 'Sushi Salmon', 4.0),
(58, 13, 'Sushi Saumon Tsukudani', 2.0),
(59, 13, 'Edamame / Salade de chou', 1.0);

-- --------------------------------------------------------
--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `email` varchar(160) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `user_type` varchar(50) NOT NULL DEFAULT 'client',
  `is_student` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ref` (`ref`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `product_flavors`
--
ALTER TABLE `product_flavors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `product_items`
--
ALTER TABLE `product_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `product_flavors`
--
ALTER TABLE `product_flavors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT pour la table `product_items`
--
ALTER TABLE `product_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `product_flavors`
--
ALTER TABLE `product_flavors`
  ADD CONSTRAINT `product_flavors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `product_items`
--
ALTER TABLE `product_items`
  ADD CONSTRAINT `product_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
