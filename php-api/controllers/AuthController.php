<?php

function handleAuthRequest($method, $segments) {
    if ($method === 'POST' && isset($segments[1]) && $segments[1] === 'register') {
        register();
    } else if ($method === 'GET' && isset($segments[1]) && $segments[1] === 'roles') {
        // Retourne la liste des rôles disponibles
        echo json_encode(['roles' => ['client', 'client_etudiant', 'admin']]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
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
