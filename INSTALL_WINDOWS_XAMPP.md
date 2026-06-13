# Installation et configuration Windows pour XAMPP (v2_remote)
# ====================================================
# Instructions pour installer et configurer XAMPP sur Windows pour ce jeu Songo.

## 1. Installer XAMPP

### Option 1 : Installer depuis le site officiel
1. Visitez : https://www.apachefriends.org/fr/index.html
2. Téléchargez le programme d'installation pour Windows
3. Suivez les étapes d'installation (par défaut, XAMPP s'installe dans `C:\xampp`)
4. **CRUCIAL** : Cochez les cases pour installer Apache, MySQL, PHP et l'extension "php_mysql" (ou similaire) pendant l'installation

### Option 2 : Utiliser Windows Store (si disponible)
1. Ouvrez Microsoft Store
2. Recherchez "XAMPP" ou "Apache Friends XAMPP"
3. Installez et lancez

## 2. Vérifier l'installation de PHP

1. Ouvrez la console Windows
2. Exécutez : `php --version`
3. Elle devrait afficher quelque chose comme : `PHP 8.x.x (cli) (built: ...)`

Si ce n'est pas le cas, assurez-vous d'avoir ajouté le dossier `C:\xampp\php` à votre variable `PATH`.

## 3. Déployer les fichiers du jeu

1. Localisez le dossier `C:\xampp\htdocs` (ou un dossier personnalisé si vous l'avez modifié)
2. Ouvrez-le et y collez l'ensemble du dossier `v2_remote`
   - Si `v2_remote` est dans le même dossier, il suffit de glisser-déposer
   - Ou créez un dossier `songo` et déployez vos fichiers là-bas

## 4. Démarrer les services

### En utilisant le Gestionnaire de contrôle XAMPP
1. Ouvrez `C:\xampp\xampp-control-panel.exe` (ou `C:\xampp\manager-windows.exe`)
2. Cliquez sur **Start Server** pour Apache
3. Cliquez sur **Start Server** pour MySQL (si nécessaire)
4. Le serveur Apache devrait maintenant être accessible sur `http://localhost`

### En utilisant la console
1. Ouvrez la console Windows
2. Exécutez : `C:\xampp\xampp-control-panel.exe` (ou `cd C:\xampp && ..\apache\bin\httpd -k install` si nécessaire)
3. Ou depuis la console des administrateurs : `net stop httpd` d'abord, puis `net start httpd`

## 5. Tester le déploiement

### Méthode 1 : Page d'accueil (si le projet est à la racine)
1. Ouvrez n'importe quel navigateur web
2. Accédez à : `http://localhost`
3. Ou `http://127.0.0.1`

### Méthode 2 : Page de test (si le projet est dans un sous-dossier)
1. Si vous avez déployé dans `C:\xampp\htdocs\songo`
2. Accédez à : `http://localhost/songo`
3. Ou `http://localhost/songo/index_test.html` pour une page de test rapide

### Méthode 3 : Page principale du projet
1. Si vous avez déployé dans un sous-dossier, accédez à : `http://localhost/songo/index.html`

## 6. Résolution des problèmes

### Apache ne s'affiche pas
- **Vérification de l'installation** : `httpd -v` dans la console
- **Service Apache** : Ouvrez les services (`services.msc`) et démarrez "Apache HTTP Server"
- **Port 80 bloqué** : Exécutez en tant qu'administrateur : `net stop "IIS Admin Service"` puis `net start httpd`

### Erreur PHP
- **PHP manquant** : Assurez-vous que `C:\xampp\php` est dans le PATH
- **Extensions PHP manquantes** : Installez `php_mysql.dll`, `php_json.dll`, etc.
- **Permissions du fichier server.php** : Assurez-vous que `server.php` est accessible en écriture pour créer `state.json`

### Fonctionnalité JavaScript bloquée
- **Popup de blocage du navigateur** : Assurez-vous que votre navigateur accepte les cookies et le stockage local
- **Vérifier le chemin** : Assurez-vous que tous les fichiers sont accessibles depuis `http://localhost/...`

## 7. Configuration avancée (optionnelle)

### Changer le port
Si vous avez besoin d'utiliser un autre port (par exemple, 8080) :

1. Modifiez le dossier `C:\xampp\apache\conf\httpd.conf`
2. Trouvez `Listen 80` et changez-le en : `Listen 8080`
3. Redémarrez Apache
4. Utilisez : `http://localhost:8080/songo`

### Désactiver le dossier d'administration par défaut de XAMPP
Si vous souhaitez utiliser un nom de dossier personnalisé : 

1. Déplacez le contenu du dossier `C:\xampp\htdocs\xampp` vers `C:\xampp\htdocs\admin_xampp`
2. Modifiez `C:\xampp\apache\conf\extra\httpd-vhosts.conf` pour rediriger vers votre nom de dossier personnalisé

## 8. Production vs local

### Local (pour le développement)
- Utilisez : `http://localhost/songo`
- Plus rapide, facile à tester

### Test local (avec interface de test)
- Utilisez : `http://localhost/songo/index_test.html`
- Sert de page d'état rapide pour vérifier si tout fonctionne

### Environnement de production (hébergement web payant)
- Déployez les fichiers sur un serveur web qui prend en charge PHP
- Assurez-vous que le chemin `state.json` est accessible en écriture

## 9. Sauvegarde du projet

Pour sauvegarder votre installation XAMPP et votre jeu :

1. Faites une sauvegarde des dossiers `C:\xampp\htdocs\songo`
2. Sauvegardez le fichier `C:\xampp\htdocs\songo\state.json` (si vous en avez un)
3. Conservez `C:\xampp\xampp-files\` intact (configuration XAMPP)

## 10. Mettre à jour le jeu

Pour mettre à jour le jeu :

1. Téléchargez la nouvelle version du projet v2_remote
2. Remplacez les anciens fichiers dans `C:\xampp\htdocs\songo`
3. Redémarrez Apache si nécessaire
4. Supprimez l'ancien fichier `state.json` si vous souhaitez une nouvelle partie

## Remarques finales

- Tous les chemins sont des chemins Windows absolus (pas de chemins d'accents)
- PHP doit être correctement configuré pour utiliser MySQL
- Le jeu dépend de `state.json` qui sera créé automatiquement au premier lancement
- Pour un développement plus avancé, VS Code + Live Server extension est recommandé

## Aide-mémoire rapide

```bash
# Vérifier si Apache est en cours d'exécution
netstat -a -n | grep 80

# Arrêter/redémarrer Apache
net stop httpd
net start httpd

# Vérifier la version de PHP
php -v

# Vérifier si MySQL est en cours d'exécution
netstat -a -n | grep 3306
```

Si vous rencontrez des difficultés, consultez le FAQ de XAMPP ou postulez des questions ici !