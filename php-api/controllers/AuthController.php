<?php

function handleAuthRequest($method, $segments) {
    // Debug log: méthode + segments
    @file_put_contents(__DIR__ . '/../api_debug.txt', date('c') . " handleAuthRequest method=" . $method . " segments=" . json_encode($segments) . PHP_EOL, FILE_APPEND);

    if ($method === 'POST' && isset($segments[1]) && $segments[1] === 'register') {
        register();
    } else if ($method === 'POST' && isset($segments[1]) && $segments[1] === 'login') {
        login();
    } else if ($method === 'GET' && isset($segments[1]) && $segments[1] === 'roles') {
        // Retourne la liste des rôles disponibles
        echo json_encode(['roles' => ['client', 'client_etudiant', 'admin']]);
    } else {
        http_response_code(405);
        // Fournir un peu plus d'info en dev pour diagnostiquer
        echo json_encode(['error' => 'Méthode non autorisée', 'method' => $method, 'segments' => $segments]);
    }
}

function register() {
    $pdo = Database::connect();
    $data = json_decode(file_get_contents('php://input'), true);

    // Validation simple
    if (empty($data['email']) || empty($data['password']) || empty($data['role'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Données incomplètes']);
        return;
    }

    // Valider le rôle
    $allowedRoles = ['client', 'client_etudiant', 'admin'];
    if (!in_array($data['role'], $allowedRoles)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Rôle invalide']);
        return;
    }

    // Déterminer si c'est un étudiant selon le rôle choisi
    $isStudent = ($data['role'] === 'client_etudiant') ? 1 : 0;

    // Hachage du mot de passe
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

    try {
        // Vérifier si l'email existe déjà
        $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$data['email']]);
        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Email déjà utilisé']);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO users (last_name, first_name, birth_date, email, phone, password, address, zip_code, city, user_type, is_student) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $data['last_name'] ?? null,
            $data['first_name'] ?? null,
            $data['birth_date'] ?? null,
            $data['email'],
            $data['phone'] ?? null,
            $hashedPassword,
            $data['address'] ?? null,
            $data['zip_code'] ?? null,
            $data['city'] ?? null,
            $data['role'],
            $isStudent
        ]);

        echo json_encode(['success' => true, 'message' => 'Utilisateur créé avec succès !']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'inscription : ' . $e->getMessage()]);
    }
}

// Connexion d'un utilisateur (POST /auth/login)
function login() {
    $pdo = Database::connect();
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data === null) {
        // Corps JSON invalide ou absent
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Corps JSON invalide ou absent', 'raw' => file_get_contents('php://input')]);
        return;
    }

    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email et mot de passe requis']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, last_name, first_name, email, password, user_type, is_student FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Identifiants incorrects']);
            return;
        }

        $stored = $user['password'];
        $valid = false;

        // Si le mot de passe est haché (commence par $) on utilise password_verify,
        // sinon comparaison directe (pratique pour jeux de données locales non hachés).
        if (is_string($stored) && strlen($stored) > 0 && $stored[0] === '$') {
            $valid = password_verify($data['password'], $stored);
        } else {
            $valid = ($data['password'] === $stored);
        }

        if (!$valid) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Identifiants incorrects']);
            return;
        }

        // Nettoyer la réponse utilisateur (ne pas renvoyer le mot de passe)
        $resUser = [
            'id' => (int)$user['id'],
            'last_name' => $user['last_name'],
            'first_name' => $user['first_name'],
            'email' => $user['email'],
            'user_type' => $user['user_type'],
            'is_student' => (int)$user['is_student']
        ];

        echo json_encode(['success' => true, 'user' => $resUser]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur serveur lors de la connexion']);
    }
}
