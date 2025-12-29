<?php

function handleAuthRequest($method, $segments) {
    if ($method === 'POST' && isset($segments[1]) && $segments[1] === 'register') {
        register();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
    }
}

function register() {
    $pdo = Database::connect();
    $data = json_decode(file_get_contents('php://input'), true);

    // Validation simple
    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Données incomplètes']);
        return;
    }

    // Déterminer si c'est un étudiant selon le rôle choisi
    $isStudent = ($data['role'] === 'client_etudiant') ? 1 : 0;

    // Hachage du mot de passe
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("
            INSERT INTO users (last_name, first_name, birth_date, email, phone, password, address, zip_code, city, user_type, is_student)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $data['last_name'],
            $data['first_name'],
            $data['birth_date'],
            $data['email'],
            $data['phone'],
            $hashedPassword,
            $data['address'],
            $data['zip_code'],
            $data['city'],
            $data['role'],
            $isStudent
        ]);

        echo json_encode(['success' => true, 'message' => 'Utilisateur créé avec succès !']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'inscription : ' . $e->getMessage()]);
    }
}
