// ===================================================
// Auteur: AKANA SIGNING JOSIAS AARON | Matricule: 24H2358
// Fichier: ajax.js (v2_remote) - Communication AJAX avec le serveur
// ===================================================

// Polling: on interroge le serveur toutes les secondes
function demarrerPolling() {
    setInterval(recupererEtat, 1000);
    recupererEtat();
}

// Recuperer l'etat du jeu depuis server.php
function recupererEtat() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "server.php?action=recuperer_etat", true);
    xhr.onload = function() {
        if (xhr.status == 200) afficher(JSON.parse(xhr.responseText));
    };
    xhr.send();
}

// Envoyer un coup au serveur
function envoyerCoup(trou) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "server.php?action=jouer&trou=" + trou + "&joueur=" + mon_id, true);
    xhr.onload = function() {
        var rep = JSON.parse(xhr.responseText);
        if (rep.erreur) {
            document.getElementById('message_erreur').innerHTML = rep.erreur;
            setTimeout(function() { document.getElementById('message_erreur').innerHTML = ""; }, 2000);
        } else {
            afficher(rep);
        }
    };
    xhr.send();
}

// Reinitialiser la partie
function recommencer() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "server.php?action=reset", true);
    xhr.onload = function() { recupererEtat(); };
    xhr.send();
}
