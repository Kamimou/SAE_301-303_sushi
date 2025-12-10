Absolument \! Voici à nouveau le contenu du fichier `README.md` pour guider vos collègues dans la configuration du Back-End PHP/MySQL.

-----

# 🍣 Configuration du Back-End (API PHP/MySQL)

Ce document explique les étapes pour mettre en place l'API PHP qui sert les données à l'application Angular.

## Prérequis

Pour exécuter cette API, vous devez avoir installé et démarré les éléments suivants :

  * **XAMPP** (ou un environnement équivalent comme MAMP/WAMP)
      * Le module **Apache** (pour servir les fichiers PHP)
      * Le module **MySQL** (pour la base de données)

-----

## Étape 1 : Mise en place des fichiers PHP

Le Back-End est contenu dans le dossier `php-api/`.

1.  **Localisation du dossier :** Copiez l'intégralité du dossier `php-api/` dans le répertoire racine de votre serveur web local.
      * **Chemin typique XAMPP :** `C:\xampp\htdocs\`
2.  **Vérification de l'accès :** Une fois copié, le point d'entrée de votre API doit être accessible via l'URL : `http://localhost/php-api/index.php/`

-----

## Étape 2 : Configuration de la Base de Données (MySQL)

Cette étape crée la base de données et les tables nécessaires.

### A. Création de la Base de Données

1.  Ouvrez **phpMyAdmin** dans votre navigateur (URL typique : `http://localhost/phpmyadmin/`).
2.  Créez une nouvelle base de données nommée : **`sae_sushi`**.

### B. Création des tables

1.  Importez le schéma : Allez dans l'onglet **"Importer"** de la base de données `sae_sushi`.
2.  Sélectionnez le fichier SQL **`db/sae_sushi_schema.sql`** (ou le nom du fichier SQL d'exportation de votre base de données).
3.  Lancez l'importation. Vous devriez maintenant voir toutes les tables (`products`, `orders`, `users`, etc.) créées et remplies avec les données initiales.

-----

## Étape 3 : Configuration de la Connexion PHP

Le Back-End a besoin des identifiants de votre installation MySQL locale.

1.  Allez dans le dossier `php-api/`.
2.  Le fichier **`config.php`** est ignoré par Git pour des raisons de sécurité. Vous devez le créer.
3.  **Renommez** le fichier d'exemple **`config.sample.php`** en **`config.php`**.
4.  Ouvrez **`config.php`** et ajustez les valeurs si nécessaire :

| Constante | Rôle | Valeur par défaut XAMPP |
| :--- | :--- | :--- |
| `DB_NAME` | Nom de la BDD | `'sae_sushi'` |
| `DB_USER` | Utilisateur MySQL | `'root'` |
| `DB_PASS` | Mot de passe MySQL | `''` (vide) |

```php
// Exemple de config.php (à remplir selon votre configuration locale)
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'sae_sushi'); 
define('DB_USER', 'root');
define('DB_PASS', ''); // Mettez votre mot de passe si vous en avez un !
```

-----

## Étape 4 : Vérification du Bon Fonctionnement

1.  Assurez-vous que **Apache** et **MySQL** sont démarrés dans XAMPP.
2.  Ouvrez votre navigateur et testez la route des produits :
    ```
    http://localhost/php-api/index.php/products
    ```

**Résultat attendu :** Si la configuration est correcte, le navigateur doit afficher un **bloc de données JSON** représentant la liste des produits.

Une fois que cette URL affiche les données, vous pouvez démarrer le Front-End Angular avec `npm start`.
