<?php

// AJOUTEZ CES DEUX LIGNES POUR DÉBUGUER
ini_set('display_errors', 1);
error_reporting(E_ALL);
// FIN DU DÉBUG

// ====================================================================
// Configuration des En-têtes pour CORS et JSON
// ====================================================================

// C'est pour autoriser Angular (localhost:4200) à accéder à cette API
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Gère la requête OPTIONS (pré-vol CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ====================================================================
// Routage
// ====================================================================

// Nettoie l'URI pour identifier la ressource demandée (ex: 'products')
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Log (debug)
file_put_contents(__DIR__ . '/api_log.txt', date('c') . " $method " . $_SERVER['REQUEST_URI'] . PHP_EOL, FILE_APPEND);

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

    case 'auth':
        require 'controllers/AuthController.php';
        handleAuthRequest($method, $segments);
        break;

    case 'orders':
        require 'controllers/OrdersController.php';
        // CORRECTION NÉCESSAIRE : on appelle la fonction du contrôleur
        handleOrdersRequest($method, $segments);
        break;

    case 'contact':

    // On autorise uniquement le POST
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        exit;
    }

    // Récupération des données JSON envoyées par Angular
    $data = json_decode(file_get_contents("php://input"), true);

    // Vérification des champs obligatoires
    if (
        empty($data['name']) ||
        empty($data['email']) ||
        empty($data['message'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Champs manquants']);
        exit;
    }

    try {
        // Connexion à la base de données
        $pdo = Database::connect();

        // Insertion du message en base
        $stmt = $pdo->prepare(
            "INSERT INTO messages (name, email, message)
             VALUES (?, ?, ?)"
        );

        $stmt->execute([
            $data['name'],
            $data['email'],
            $data['message']
        ]);

        // Succès
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Message envoyé avec succès'
        ]);

    } catch (Exception $e) {
        // Erreur serveur / base de données
        http_response_code(500);
        echo json_encode([
            'error' => 'Erreur serveur',
            'details' => $e->getMessage()
        ]);
    }

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
