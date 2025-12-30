<?php

// Point d'entrée pour la gestion des requêtes Orders
function handleOrdersRequest($method, $segments) {
    if ($method === 'POST') {
        submitOrder();
    } else if ($method === 'GET') {
        $action = $segments[1] ?? '';
        if ($action === 'stats') {
            ordersStats();
        } else if ($action === 'history') { // <--- AJOUTER CE BLOC
            $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
            if ($userId) {
                getUserOrders($userId);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID utilisateur manquant.']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Action non reconnue.']);
        }
    }
}

function getUserOrders($userId) {
    $pdo = Database::connect();
    try {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors du chargement de l\'historique']);
    }
}

// GET /orders/stats
function ordersStats() {
    $pdo = Database::connect();

    try {
        // Récupérer le paramètre months (ex: ?months=6). Défaut 12, borné entre 1 et 36.
        $months = isset($_GET['months']) ? (int)$_GET['months'] : 12;
        if ($months < 1) $months = 1;
        if ($months > 36) $months = 36;

        // Calculer la date de début (premier jour du mois il y a months-1 mois)
        $startDate = (new DateTime())->modify('-' . ($months - 1) . ' months')->format('Y-m-01');

        // Log debug
        @file_put_contents(__DIR__ . '/../api_log.txt', date('c') . " orders/stats?months={$months} startDate={$startDate}\n", FILE_APPEND);

        // Récupère le nombre de commandes et le CA par mois depuis $startDate
        $stmt = $pdo->prepare("SELECT YEAR(created_at) AS y, MONTH(created_at) AS m, COUNT(*) AS orders_count, SUM(total) AS revenue
            FROM orders
            WHERE created_at >= ?
            GROUP BY y, m
            ORDER BY y, m");
        $stmt->execute([$startDate]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Construire la liste des derniers mois (format YYYY-MM)
        $labels = [];
        $ordersMap = [];
        $revenueMap = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $dt = new DateTime();
            $dt->modify("-{$i} months");
            $label = $dt->format('Y-m');
            $labels[] = $label;
            $ordersMap[$label] = 0;
            $revenueMap[$label] = 0.0;
        }

        foreach ($rows as $r) {
            $label = sprintf('%04d-%02d', $r['y'], $r['m']);
            if (array_key_exists($label, $ordersMap)) {
                $ordersMap[$label] = (int)$r['orders_count'];
                $revenueMap[$label] = (float)$r['revenue'];
            }
        }

        $ordersArr = array_values($ordersMap);
        $revenueArr = array_values($revenueMap);

        echo json_encode([
            'success' => true,
            'months' => $months,
            'labels' => $labels,
            'orders' => $ordersArr,
            'revenue' => $revenueArr
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erreur lors de la récupération des statistiques']);
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

        // Vérifier la quantité totale de boxes (max 10)
        $totalQuantity = 0;
        foreach ($validItems as $vi) {
            $totalQuantity += $vi['quantity'];
        }
        if ($totalQuantity > 10) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'La commande dépasse la limite de 10 boxes par commande.'
            ]);
            return;
        }

        // 5) Calcul des remises et insertion dans ORDERS
        // Récupérer si le client est étudiant (si fourni) sinon tenter par email
        $isStudent = 0;
        if (isset($data['customer']['isStudent'])) {
            $isStudent = $data['customer']['isStudent'] ? 1 : 0;
        } else if (!empty($data['customer']['email'])) {
            $stmtUser = $pdo->prepare("SELECT is_student FROM users WHERE email = ?");
            $stmtUser->execute([$data['customer']['email']]);
            $rowUser = $stmtUser->fetch(PDO::FETCH_ASSOC);
            $isStudent = $rowUser ? (int)$rowUser['is_student'] : 0;
        }

        $subtotal = round($totalCalculated, 2);

        $STUDENT_DISCOUNT = 9.5;
        $THRESHOLD = 50.0;
        $THRESHOLD_DISCOUNT = 1.5;
        $MAX_DISCOUNT = 9.5;

        $discountPercent = 0.0;
        if ($isStudent) $discountPercent += $STUDENT_DISCOUNT;
        if ($subtotal > $THRESHOLD) $discountPercent += $THRESHOLD_DISCOUNT;
        if ($discountPercent > $MAX_DISCOUNT) $discountPercent = $MAX_DISCOUNT;

        $discountAmount = round($subtotal * ($discountPercent / 100), 2);
        $finalTotal = round($subtotal - $discountAmount, 2);

        // RÉCUPÉRER L'ID UTILISATEUR DEPUIS LE JSON (Angular l'envoie via customer.id)
        $userId = isset($data['customer']['id']) ? (int)$data['customer']['id'] : null;

        $orderRef = uniqid('ORD-', true);

        $stmt = $pdo->prepare("
        INSERT INTO orders (ref, user_id, customer_name, total, status)
        VALUES (?, ?, ?, ?, 'Pending')
        ");
        $stmt->execute([$orderRef, $userId, $customerName, $finalTotal]);

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
            'subtotal' => $subtotal,
            'discountPercent' => $discountPercent,
            'discountAmount' => $discountAmount,
            'total' => $finalTotal
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
