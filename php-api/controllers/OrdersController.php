<?php

// Point d'entrée pour la gestion des requêtes Orders
function handleOrdersRequest($method, $segments) {
    if ($method === 'POST') {
        submitOrder();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non supportée pour la ressource commandes.']);
    }
}

// Traite la soumission d'une nouvelle commande (POST /orders)
function submitOrder() {
    $pdo = Database::connect();

    // 1) Récupérer le JSON envoyé par Angular
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    // ✅ CORRECTION : on ne bloque PLUS sur customer.name
    if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Données de commande invalides.'
        ]);
        return;
    }

    // Nom client par défaut si non fourni
    $customerName = $data['customer']['name'] ?? 'Client';

    $orderItems = $data['items'];
    $totalCalculated = 0;

    try {
        $pdo->beginTransaction();

        // 2) Récupérer les IDs produits (accepte id OU productId)
        $productIds = [];
        foreach ($orderItems as $item) {
            $pid = $item['productId'] ?? $item['id'] ?? null;
            if ($pid !== null) {
                $productIds[] = (int)$pid;
            }
        }
        $productIds = array_values(array_unique($productIds));

        if (empty($productIds)) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Aucun produit valide.'
            ]);
            return;
        }

        // 3) Récupérer les prix depuis la BDD
        $inClause = implode(',', array_fill(0, count($productIds), '?'));
        $stmt = $pdo->prepare("SELECT id, price FROM products WHERE id IN ($inClause)");
        $stmt->execute($productIds);

        $priceMap = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $priceMap[(int)$row['id']] = (float)$row['price'];
        }

        // 4) Valider les items + calculer le total
        $validItems = [];

        foreach ($orderItems as $item) {
            $id  = $item['productId'] ?? $item['id'] ?? null;
            $qty = (int)($item['quantity'] ?? 0);

            if ($id === null || $qty <= 0) continue;
            $id = (int)$id;

            if (!isset($priceMap[$id])) continue;

            $unitPrice = $priceMap[$id];
            $lineTotal = $qty * $unitPrice;
            $totalCalculated += $lineTotal;

            $validItems[] = [
                'product_id' => $id,
                'quantity' => $qty,
                'unit_price' => $unitPrice
            ];
        }

        if (empty($validItems)) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Aucun article valide dans la commande.'
            ]);
            return;
        }

        // 5) Insérer dans ORDERS
        $orderRef = uniqid('ORD-', true);

        $stmt = $pdo->prepare("
            INSERT INTO orders (ref, customer_name, total, status)
            VALUES (?, ?, ?, 'Pending')
        ");
        $stmt->execute([$orderRef, $customerName, $totalCalculated]);

        $orderId = (int)$pdo->lastInsertId();

        // 6) Insérer dans ORDER_ITEMS
        $sql = "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ";
        $placeholders = [];
        $values = [];

        foreach ($validItems as $item) {
            $placeholders[] = "(?, ?, ?, ?)";
            $values[] = $orderId;
            $values[] = $item['product_id'];
            $values[] = $item['quantity'];
            $values[] = $item['unit_price'];
        }

        $sql .= implode(', ', $placeholders);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        $pdo->commit();

        // Réponse JSON OK
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'orderRef' => $orderRef,
            'total' => $totalCalculated
        ]);

    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Erreur serveur lors de la commande'
            // Décommente en dev si besoin :
            // 'debug' => $e->getMessage()
        ]);
    }
}
