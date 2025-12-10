<?php

// Le point d'entrée du contrôleur (appelé par index.php)
function handleProductsRequest($method, $segments) {
    if ($method === 'GET') {
        getAllProducts();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non supportée.']);
    }
}


/**
 * Récupère tous les produits avec leurs compositions et saveurs et les assemble.
 */
function getAllProducts() {
    $pdo = Database::connect();
    
    try {
        // 1. Récupérer tous les produits de la table principale
        // On renomme les colonnes pour correspondre aux clés JSON (name AS nom, price AS prix, etc.)
        $stmt = $pdo->query("SELECT id, name AS nom, pieces, price AS prix, description, image_key AS image FROM products WHERE is_available = 1 ORDER BY id");
        $products = $stmt->fetchAll();

        if (empty($products)) {
            echo json_encode(['data' => []]);
            return;
        }

        // 2. Récupérer TOUS les items et saveurs en une seule fois (meilleure performance)
        $allItemsStmt = $pdo->query("SELECT product_id, item_name AS nom, quantity FROM product_items");
        $allItems = $allItemsStmt->fetchAll();

        $allFlavorStmt = $pdo->query("SELECT product_id, flavor FROM product_flavors");
        $allFlavors = $allFlavorStmt->fetchAll();

        // 3. Mappage : Organiser les compositions et saveurs par product_id
        $itemsMap = [];
        foreach ($allItems as $item) {
            $itemsMap[$item['product_id']][] = [
                'nom' => $item['nom'],
                'quantite' => (float)$item['quantity']
            ];
        }

        $flavorsMap = [];
        foreach ($allFlavors as $flavor) {
            $flavorsMap[$flavor['product_id']][] = $flavor['flavor'];
        }

        // 4. Assembler les données dans la structure finale attendue
        foreach ($products as &$product) {
            $id = $product['id'];
            $product['aliments'] = $itemsMap[$id] ?? [];
            $product['saveurs'] = $flavorsMap[$id] ?? [];
            
            // Conversion finale du prix en float pour le JSON
            $product['prix'] = (float)$product['prix'];
        }
        
        http_response_code(200);
        // Renvoyer le JSON
        echo json_encode($products); // IMPORTANT: Nous renvoyons la liste directe, pas un objet {'data': [...]}
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erreur serveur lors de la récupération des produits.']);
    }
}
