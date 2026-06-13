# Songo Windows Setup Script

## Auteur
AKANA SIGNING JOSIAS AARON | Matricule: 24H2358

## Description
Script batch Windows PowerShell pour installer et configurer XAMPP et ce jeu Songo sur Windows.

## Fonctionnalités
- Installe XAMPP (téléchargement automatique si nécessaire)
- Configure Apache et MySQL
- Déploie les fichiers du jeu
- Vérifie la configuration
- Configure automatiquement les variables d'environnement

## Prérequis
- Windows 10/11 (64-bit)
- Accès administrateur
- Connexion Internet

## Utilisation

### Installation et déploiement (exécuter en tant qu'administrateur)

1. Copiez ce fichier `setup_windows.ps1` dans n'importe quel dossier
2. Ouvrez PowerShell en tant qu'administrateur
3. Naviguez jusqu'au dossier contenant le script
4. Exécutez : `Set-ExecutionPolicy RemoteSigned -Scope Process -Force`
5. Exécutez : `.
setup_windows.ps1`

### Script rapide (copier-coller)

```powershell
# Configurer l'exécution des scripts
Set-ExecutionPolicy RemoteSigned -Scope Process -Force

# Installer et déployer
irm https://example.com/setup_windows.ps1 | iex
```

## Notes importantes

### L'utilisation de ce script comporte des risques !
- Modifie les services Windows (Apache, MySQL)
- Peut écraser des installations XAMPP existantes
- Configure les chemins de PHP dans le PATH système
- Modifie les règles du pare-feu Windows

### Configuration requise
- PHP avec l'extension php_mysql.dll
- Permissions d administrateur pour configurer les services
- Accès au dossier C:\xampp

### Fonctionnement
1. Télécharge XAMPP (si non installé)
2. Installe Apache et MySQL
3. Configure PHP et ajoute les extensions MySQL
4. Déploie les fichiers du jeu dans C:\xampp\htdocs\songo
5. Configure Apache pour servir le dossier des jeux
6. Configure les variables d'environnement PHP
7. Démarre les services nécessaires
8. Effectue des tests de vérification
9. Affiche les instructions finales

### Problèmes connus et solutions

#### Problème : "Dépasse le paramètre de profondeur"
**Solution** : Augmente le paramètre de profondeur dans PowerShell :
```powershell
$PSVersionTable.PSVersion
# Si PSVersion >= 7, définissez la profondeur à 0
$ProgressPreference = 'SilentlyContinue'
```

#### Problème : "L'exécution des scripts n'est pas autorisée"
**Solution** :
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

#### Problème : "Accès refusé"
**Solution** : Exécutez PowerShell en tant qu'administrateur

#### Problème : "Apache/MYSQL déjà en cours d'exécution"
**Solution** : Le script arrêtera et redémarrera les services

## Programme

```powershell
# Section 1: Configuration et vérifications initiales
Write-Host "=== Préparation de l'environnement ===" -ForegroundColor Yellow

# Vérifier si nous sommes administrateur
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)) {
    Write-Host "ERREUR : Ce script doit être exécuté en tant qu'administrateur !" -ForegroundColor Red
    Write-Host "Fermez PowerShell et réouvrez-le en tant qu'administrateur." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter..."
    exit 1
}

# ... (continuer avec le reste du script)
```

### Informations de débogage

#### Codes d'erreur courants
- **Code 5** : Accès refusé (permissions administrateur manquantes)
- **Code 1610** : Opération installée
- **Code 1638** : Déjà installé

#### Fichiers de journalisation
- `C:\xampp\logs\setup_windows.log` : Journal des installations
- `C:\xampp\logs\error.log` : Erreurs Apache
- `C:\xampp\logs\mysql\error.log` : Erreurs MySQL

#### Commandes de maintenance

```powershell
# Arrêter tous les services XAMPP
net stop httpd
net stop mysqld

# Supprimer XAMPP ( Attention : supprime tous les fichiers ! )
# C:\xampp\uninstall.bat

# Réinstaller PHP
php -v
```

### Questions fréquentes

**Q : Le script va-t-il écraser mon installation XAMPP existante ?**
R : Oui, il peut écraser Apache et MySQL existants, mais préservera vos fichiers de configuration.

**Q : Dois-je installer XAMPP manuellement d'abord ?**
R : Non, le script installera XAMPP automatiquement si ce n'est pas déjà fait.

**Q : Le jeu fonctionnera-t-il sur tous les systèmes Windows ?**
R : Cela devrait fonctionner sur Windows 10/11. Windows 7/8 peuvent nécessiter des étapes supplémentaires.

**Q : Comment puis-je tester si tout fonctionne ?**
R : Ouvrez `http://localhost/songo/index_test.html` pour une vérification rapide.

**Q : Le script modifie-t-il le système de fichiers au-delà de C:\xampp ?**
R : Non, il se limite à C:\xampp et au dossier des jeux.

## Avertissement

Ce script modifie les services Windows et les chemins système.
Faites une sauvegarde de votre système avant de l'utiliser.
L'auteur n'est pas responsable des pertes de données ou des problèmes système.

## Contact
Si vous avez des questions ou des problèmes, contactez l'auteur via votre système de support habituel.

### Remarques finales

Ce script est conçu pour une configuration rapide sur Windows, mais n'est pas recommandé pour un environnement de production de haute sécurité.
Pour un hébergement professionnel, utilisez un service de cloud computing ou un serveur dédié.

Pour une installation plus avancée, vous pouvez également installer manuellement XAMPP et déployer les fichiers manuellement.

---
Script créé par AKANA SIGNING JOSIAS AARON (24H2358)
Pour toute aide ou assistance, n'hésitez pas à demander !