# Songo-

# README - Windows Deployment Instructions

## Installation sur Windows

### 1. Installer XAMPP (Recommandé)

1. Téléchargez XAMPP depuis https://www.apachefriends.org/fr/index.html
2. Installez Apache, MySQL, PHP (et les modules nécessaires)
3. Ouvrez le dossier xampp et lancez le gestionnaire de contrôle
4. Démarrez Apache et MySQL

### 2. Déployer le projet

1. Copiez tout le contenu du dossier `v2_remote` dans le dossier `htdocs` de XAMPP (par exemple, `C:\xampp\htdocs\songo`)
2. Ou créez un nouveau dossier dans `C:\xampp\htdocs` et copiez les fichiers là-bas

### 3. Vérifier

1. Ouvrez votre navigateur web (Edge/Chrome/Firefox/Opera)
2. Accédez à : `http://localhost/songo`
3. Ou `http://localhost/v2_remote` si vous l'avez déployé dans un sous-dossier

### 4. Jouer

1. Choisissez votre camp : **Joueur 1 (Bas)** ou **Joueur 2 (Haut)**
2. Le plateau de jeu s'affichera avec le tour du joueur actuel
3. Cliquez sur n'importe quelle case allumée qui vous appartient pour faire votre coup
4. Les scores s'afficheront en temps réel
5. Cliquez sur **Nouvelle Partie** pour redémarrer

## Configuration alternative pour éditeurs de code

Si vous utilisez VS Code avec le Live Server extension:

1. Copiez le dossier `v2_remote` dans un emplacement accessible
2. Ouvrez VS Code
3. Ouvrez la page d'accueil (index.html)
4. Installez l'extension "Live Server"
5. Cliquez sur l'icône Live Server pour ouvrir le serveur local

## Préparation pour le web (optionnel)

Pour publier le jeu en ligne (nécessite un serveur web capable d'exécuter PHP) : 

1. Installez un serveur web compatible avec PHP (Apache/Nginx/IIS)
2. Déployez les fichiers sur le serveur web avec les permissions d'exécution appropriées
3. Assurez-vous que le fichier `state.json` existe ou sera créé au premier démarrage

## Remarques

- Le jeu utilise des cookies du navigateur et le stockage local pour la persistance des données de jeu
- La partie est sauvegardée dans `state.json` et sera persistée entre les actualisations
- Tous les fichiers sont compatibles avec Windows (pas de chemins d'accents)

## Dépannage

### Jeu vide
- Assurez-vous que le fichier server.php est accessible
- Vérifiez les permissions du fichier `state.json` (créera automatiquement s'il n'existe pas)

### Erreur de connexion
- Assurez-vous que PHP est correctement installé et configuré sur votre serveur local
- Vérifiez que le dossier `htdocs` contient tous les fichiers (index.html, script.js, ajax.js, server.php, style.css)

### Game Loading Issues
- Si la page ne se charge pas, vérifiez si index.html utilise des chemins absolus (comme dans l'original) ou relatifs

## Copyright
AKANA SIGNING JOSIAS AARON (24H2358)