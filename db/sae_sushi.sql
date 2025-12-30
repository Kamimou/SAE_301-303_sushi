-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 30 déc. 2025 à 02:31
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

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ref` varchar(32) NOT NULL,
  `customer_name` varchar(120) NOT NULL,
  `total` decimal(8,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `ref`, `customer_name`, `total`, `status`, `created_at`) VALUES
(1, 1, 'ORD-695299bf5399c5.74812886', 'Kilian Corpet', 71.61, 'Pending', '2025-12-29 16:09:51'),
(2, 2, 'ORD-6953164ba1c713.20707373', 'Gerance Leny', 28.40, 'Pending', '2025-12-30 01:01:15'),
(3, 2, 'ORD-69531c298e4669.29592415', 'Gerance Leny', 74.96, 'Pending', '2025-12-30 01:26:17'),
(4, 3, 'ORD-69531dce7c7cc9.35609896', 'Pokta Salih', 57.56, 'Pending', '2025-12-30 01:33:18');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 1, 2, 12.50),
(2, 1, 2, 3, 15.90),
(3, 2, 1, 1, 12.50),
(4, 2, 2, 1, 15.90),
(5, 3, 1, 1, 12.50),
(6, 3, 7, 3, 15.90),
(7, 3, 8, 1, 15.90),
(8, 4, 7, 2, 15.90),
(9, 4, 8, 1, 15.90),
(10, 4, 9, 1, 15.90);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

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
(1, 'Tasty Blend', 12, 12.50, 'Description du Tasty Blend :\r\n\r\nAssortiment équilibré de makis saumon, makis avocat, nigiris saumon, accompagnés d’edamame et de pousses de daikon. Riz vinaigré et algue nori.', 'tasty-blend', 1),
(2, 'Amateur Mix', 18, 15.90, 'Description de l\'Amateur Mix :\r\n\r\nSélection idéale pour débuter : makis saumon, makis avocat, makis concombre, avec nigiris saumon, edamame et pousses de daikon.', 'amateur-mix', 1),
(3, 'Saumon Original', 11, 12.50, 'Description du Saumon Original :\r\n\r\nClassique incontournable composé de nigiris saumon et makis saumon, préparés avec du saumon frais, riz vinaigré et algue nori.', 'saumon-original', 1),
(4, 'Salmon Lovers', 18, 15.90, 'Description du Salmon Lovers :\r\n\r\nPour les amateurs de saumon : nigiris saumon, makis saumon, california saumon avocat, accompagnés d’edamame et de pousses de daikon.', 'salmon-lovers', 1),
(5, 'Salmon Classic', 10, 15.90, 'Description du Salmon Classic :\r\n\r\nAssortiment généreux de nigiris saumon et makis saumon, mettant à l’honneur le saumon cru, le riz vinaigré et l’algue nori.', 'salmon-classic', 1),
(6, 'Master Mix', 12, 15.90, 'Description du Master Mix :\r\n\r\nMix complet et varié : makis saumon, makis avocat, nigiris saumon, thon, edamame et pousses de daikon.', 'master-mix', 1),
(7, 'Sunrise', 18, 15.90, 'Description du Sunrise :\r\n\r\nAssortiment coloré composé de california rolls saumon, makis avocat, makis concombre, accompagné d’edamame et de pousses de daikon.', 'sunrise', 1),
(8, 'Sando Box Chicken Katsu', 13, 15.90, 'Description du Sando Box Chicken Katsu :\r\n\r\nSandwich japonais moelleux garni de poulet pané katsu, salade, sauce tonkatsu, accompagné de makis concombre et makis avocat.', 'sando-box-chicken-katsu', 1),
(9, 'Sando Box Salmon Aburi', 13, 15.90, 'Description du Sando Box Salmon Aburi :\r\n\r\nSandwich japonais au saumon aburi légèrement snacké, riz vinaigré, salade et sauce, servi avec california rolls et edamame.', 'sando-box-salmon-aburi', 1),
(10, 'Super Salmon', 24, 19.90, 'Description du Super Salmon :\r\n\r\nAssortiment premium de makis saumon, california saumon avocat, nigiris saumon, edamame et pousses de daikon.', 'super-salmon', 1),
(11, 'California Dream', 24, 19.90, 'Description du California Dream :\r\n\r\nSélection gourmande de california rolls (saumon, avocat, concombre), makis variés, accompagnés d’edamame.', 'california-dream', 1),
(12, 'Gourmet Mix', 22, 24.50, 'Description du Gourmet Mix :\r\n\r\nAssortiment haut de gamme avec makis saumon, makis épicés, california rolls, nigiris saumon, edamame et garnitures fraîches.', 'gourmet-mix', 1),
(13, 'Fresh Mix', 22, 24.50, 'Description du Fresh Mix :\r\n\r\nMix frais et généreux composé de nigiris saumon, makis saumon, california rolls, makis tempura, edamame et pousses de daikon.', 'fresh-mix', 1);

-- --------------------------------------------------------

--
-- Structure de la table `product_flavors`
--

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

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `last_name`, `first_name`, `birth_date`, `email`, `phone`, `password`, `address`, `zip_code`, `city`, `user_type`, `is_student`, `created_at`) VALUES
(1, 'Corpet', 'Kilian', '2025-12-12', 'kiliancorpet@gmail.com', '0787696359', '$2y$10$gWWA4K11HYVwyFK4n6wOyeyrq0qYb/IUSMyMkbkZAxV8SvRFZ1bCy', '27 Chemin de Crécy', '77100', 'Nanteuil-lès-Meaux', 'admin', 0, '2025-12-29 16:09:18'),
(2, 'Leny', 'Gerance', '2003-11-27', 'lenygerance@gmail.com', '0123456789', '$2y$10$6eiogTnduJ1bcMUjaFyjC.HrFEPv8iUuuluosJmxd/8CsNzwGcdpO', '33 simple texte de l\'info', '77340', 'Pontault', 'client', 0, '2025-12-30 00:34:46'),
(3, 'Salih', 'Pokta', '2006-02-28', 'molaire@gmail.com', '0234567891', '$2y$10$N05NmySFm39iKDeY2Z3wL.q0GYIw3FrgG4j4UGVrKkjodAlS49w9m', '8 rue de la pommade', '77321', 'Massy', 'client_etudiant', 1, '2025-12-30 01:32:43');

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
  ADD UNIQUE KEY `ref` (`ref`),
  ADD KEY `fk_orders_user` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
