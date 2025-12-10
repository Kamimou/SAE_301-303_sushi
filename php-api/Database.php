<?php

require_once 'config.php';

/**
 * Classe utilitaire pour la connexion Singleton à la base de données (PDO).
 */
class Database {
    private static $connection = null;

    /**
     * Établit la connexion à la base de données.
     * @return PDO Instance de la connexion PDO.
     */
    public static function connect() {
        if (self::$connection === null) {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
            try {
                // Création d'une nouvelle connexion PDO
                self::$connection = new PDO($dsn, DB_USER, DB_PASS);
                
                // Configuration des options PDO (gestion des erreurs et format de récupération)
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                // Échec de la connexion
                http_response_code(500);
                die(json_encode(['error' => 'Erreur serveur: Impossible de se connecter à la base de données.']));
            }
        }
        return self::$connection;
    }
}