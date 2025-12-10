<?php

// Inclusion de la classe Database
// Note : La classe Database est déjà incluse via index.php

/**
 * Point d'entrée pour la gestion des requêtes Orders.
 */
function handleOrdersRequest($method, $segments) {
    if ($method === 'POST') {
        submitOrder();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non supportée pour la ressource commandes.']);
    }
}


/**
 * Traite la soumission d'une nouvelle commande (POST /orders).
 */
function submitOrder() {
    $pdo = Database::connect();
    
    // 1. Récupérer les données JSON brutes de la requête Angular
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // Vérification de base des données requises
    if (!isset($data['items']) || !is_array($data['items']) || empty($data['items']) || !isset($data['customer']['name'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Données de commande invalides.']);
        return;
    }

    $customerName = $data['customer']['name'] ?? 'Client Anonyme';
    $orderItems = $data['items'];
    $notes = $data['notes'] ?? null;
    $totalCalculated = 0; // Le total sera calculé côté serveur pour des raisons de sécurité

    // Pour garantir l'intégrité des données
    try {
        $pdo->beginTransaction();

        // 2. Calculer le total et valider les produits (récupérer le prix depuis la BDD)
        $validItems = [];
        $productIds = array_column($orderItems, 'productId');
        $inClause = implode(',', array_fill(0, count($productIds), '?'));
        
        $stmt = $pdo->prepare("SELECT id, name, price FROM products WHERE id IN ($inClause)");
        $stmt->execute($productIds);
        $productsMap = $stmt->fetchAll(PDO::FETCH_KEY_PAIR | PDO::FETCH_COLUMN); // Map: [id => price]

        // On doit re-fetcher pour avoir le nom, donc on refait la requête ou on change le mode de fetch
        $stmt = $pdo->prepare("SELECT id, name, price FROM products WHERE id IN ($inClause)");
        $stmt->execute($productIds);
        $productsDetails = $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC); // Map: [id => [details]]

        foreach ($orderItems as $item) {
            $id = $item['productId'];
            $qty = (int)$item['quantity'];

            if ($qty > 0 && isset($productsDetails[$id])) {
                $productDetail = $productsDetails[$id][0];
                $unitPrice = (float)$productDetail['price'];
                $lineTotal = $qty * $unitPrice;
                
                $totalCalculated += $lineTotal;
                
                $validItems[] = [
                    'product_id' => $id,
                    'quantity' => $qty,
                    'unit_price' => $unitPrice,
                ];
            }
        }

        if (empty($validItems)) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Aucun article valide dans la commande.']);
            return;
        }

        // 3. Insérer dans la table ORDERS
        $orderRef = uniqid('ORD-', true); // Générer une référence unique
        
        $stmt = $pdo->prepare("
            INSERT INTO orders (ref, customer_name, total, status)
            VALUES (?, ?, ?, 'Pending')
        ");
        $stmt->execute([
            $orderRef, 
            $customerName, 
            $totalCalculated
        ]);
        
        $orderId = $pdo->lastInsertId();

        // 4. Insérer dans la table ORDER_ITEMS
        $sql = "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ";
        $placeholders = [];
        $values = [];
        
        foreach ($validItems as $item) {
            $placeholders[] = '(?, ?, ?, ?)';
            $values[] = $orderId;
            $values[] = $item['product_id'];
            $values[] = $item['quantity'];
            $values[] = $item['unit_price'];
        }

        $sql .= implode(', ', $placeholders);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        // 5. Validation finale
        $pdo->commit();

        http_response_code(201); // 201 Created
        echo json_encode([
            'success' => true,
            'orderRef' => $orderRef,
            'total' => $totalCalculated
        ]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        // Pour ce loguer $e->getMessage() sur un vrai serveur
        echo json_encode(['success' => false, 'error' => 'Erreur serveur lors de l\'enregistrement de la commande.']);
    }
}