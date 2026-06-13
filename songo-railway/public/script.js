var mon_id = -1;

function choisirJoueur(id) {
    mon_id = id;
    document.getElementById('choix_joueur').style.display = 'none';
    document.getElementById('zone_jeu').style.display = 'block';
    document.getElementById('mon_role').innerHTML = "Joueur " + (id + 1) + (id == 0 ? " (Bas)" : " (Haut)");
    demarrerPolling();
}

function afficher(etat) {
    if (!etat || etat.error) return;
    var haut = document.getElementById('ligne_haut');
    var bas = document.getElementById('ligne_bas');
    haut.innerHTML = "";
    bas.innerHTML = "";
    var cestMonTour = (etat.currentPlayer == mon_id);

    for (var i = 13; i >= 7; i--) {
        var d = document.createElement("div");
        d.className = "trou" + (!cestMonTour || mon_id != 1 ? " bloque" : "");
        d.innerHTML = etat.board[i];
        d.onclick = (function(idx) { return function() { if (cestMonTour && mon_id == 1) envoyerCoup(idx); }; })(i);
        haut.appendChild(d);
    }

    for (var i = 0; i <= 6; i++) {
        var d = document.createElement("div");
        d.className = "trou" + (!cestMonTour || mon_id != 0 ? " bloque" : "");
        d.innerHTML = etat.board[i];
        d.onclick = (function(idx) { return function() { if (cestMonTour && mon_id == 0) envoyerCoup(idx); }; })(i);
        bas.appendChild(d);
    }

    document.getElementById('score_j1').innerHTML = etat.scores[0];
    document.getElementById('score_j2').innerHTML = etat.scores[1];

    if (etat.winner !== null) {
        var g = etat.winner == 0 ? "Joueur 1" : etat.winner == 1 ? "Joueur 2" : "Egalite";
        document.getElementById('info_tour').innerHTML = "FIN! " + g + (g != "Egalite" ? " gagne!" : "");
    } else {
        document.getElementById('info_tour').innerHTML = "Tour: Joueur " + (etat.currentPlayer + 1);
    }
}

function demarrerPolling() {
    setInterval(recupererEtat, 1000);
    recupererEtat();
}

function recupererEtat() {
    fetch('/api/state')
        .then(function(r) { return r.json(); })
        .then(function(etat) { afficher(etat); })
        .catch(function() {});
}

function envoyerCoup(trou) {
    fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: mon_id, hole: trou })
    })
    .then(function(r) { return r.json(); })
    .then(function(rep) {
        if (rep.error) {
            document.getElementById('message_erreur').innerHTML = rep.error;
            setTimeout(function() { document.getElementById('message_erreur').innerHTML = ""; }, 2000);
        } else {
            afficher(rep);
        }
    })
    .catch(function() {});
}

function recommencer() {
    fetch('/api/reset', { method: 'POST' })
        .then(function() { recupererEtat(); })
        .catch(function() {});
}
