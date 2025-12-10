<?php

// AJOUTEZ CES DEUX LIGNES POUR DÉBUGUER
ini_set('display_errors', 1);
error_reporting(E_ALL);
// FIN DU DÉBUG

// ... Le reste du code de index.php ...

// ====================================================================
// Configuration des En-têtes pour CORS et JSON
// ====================================================================

//C'est pour autoriser Angular (localhost:4200) à accéder à cette API
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Gére la requête OPTIONS (pré-vol CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ====================================================================
// Routage
// ====================================================================

// Nettoye l'URI pour identifier la ressource demandée (ex: 'products')
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$uri = parse_url($uri, PHP_URL_PATH);
$uri = str_replace('/php-api/index.php', '', $uri);
$uri = trim($uri, '/');
$segments = explode('/', $uri);
$resource = $segments[0] ?? '';

// Inclusion des dépendances
require_once 'Database.php';

// Dispatcher la requête vers le bon contrôleur
switch ($resource) {
    case 'products':
        require 'controllers/ProductsController.php';
        handleProductsRequest($method, $segments);
        break;
        
    case 'orders':
        require 'controllers/OrdersController.php';
        break;
    case 'contact':
        http_response_code(501); // Non implémenté
        echo json_encode(['error' => 'Route non implémentée.']);
        break;
        
    case '':
    case 'health':
        http_response_code(200);
        echo json_encode(['status' => 'ok', 'message' => 'API Sushi en ligne.']);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Route introuvable.']);
        break;
}