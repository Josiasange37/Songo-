// ===================================================
// Auteur: AKANA SIGNING JOSIAS AARON | Matricule: 24H2358
// Fichier: script.js (v2_remote) - Affichage et selection du joueur
// ===================================================

var mon_id = -1; // identifiant du joueur (-1 = pas choisi)

// Selection du joueur
function choisirJoueur(id) {
    mon_id = id;
    document.getElementById('choix_joueur').style.display = 'none';
    document.getElementById('zone_jeu').style.display = 'block';
    document.getElementById('mon_role').innerHTML = "Joueur " + (id + 1) + (id == 0 ? " (Bas)" : " (Haut)");
    demarrerPolling(); // demarrer le rafraichissement (defini dans ajax.js)
}

// Affichage du plateau recu du serveur
function afficher(etat) {
    var haut = document.getElementById('ligne_haut');
    var bas = document.getElementById('ligne_bas');
    haut.innerHTML = "";
    bas.innerHTML = "";
    var cestMonTour = (etat.joueur_qui_joue == mon_id);

    for (var i = 13; i >= 7; i--) {
        var d = document.createElement("div");
        d.className = "trou" + (!cestMonTour || mon_id != 1 ? " bloque" : "");
        d.innerHTML = etat.le_plateau[i];
        d.onclick = (function(idx) { return function() { if (cestMonTour && mon_id == 1) envoyerCoup(idx); }; })(i);
        haut.appendChild(d);
    }

    for (var i = 0; i <= 6; i++) {
        var d = document.createElement("div");
        d.className = "trou" + (!cestMonTour || mon_id != 0 ? " bloque" : "");
        d.innerHTML = etat.le_plateau[i];
        d.onclick = (function(idx) { return function() { if (cestMonTour && mon_id == 0) envoyerCoup(idx); }; })(i);
        bas.appendChild(d);
    }

    document.getElementById('score_j1').innerHTML = etat.les_scores[0];
    document.getElementById('score_j2').innerHTML = etat.les_scores[1];

    if (etat.le_gagnant !== null) {
        var g = etat.le_gagnant == 0 ? "Joueur 1" : etat.le_gagnant == 1 ? "Joueur 2" : "Egalite";
        document.getElementById('info_tour').innerHTML = "FIN! " + g + (g != "Egalite" ? " gagne!" : "");
    } else {
        document.getElementById('info_tour').innerHTML = "Tour: Joueur " + (etat.joueur_qui_joue + 1);
    }
}
