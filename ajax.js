var codePartie = null;
var intervalId = null;

function montrerCreer() {
    hide('ecran_accueil');
    show('ecran_creer');
    document.getElementById('code_affichage').textContent = '...';
    document.getElementById('attente_msg').textContent = 'Création...';

    ajax('GET', 'server.php?action=creer', function(r) {
        codePartie = r.code;
        document.getElementById('code_affichage').textContent = codePartie;
        document.getElementById('attente_msg').textContent = 'En attente d\'un joueur...';
        attendreJoueur();
    });
}

function attendreJoueur() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(function() {
        if (!codePartie) return;
        ajax('GET', 'server.php?action=recuperer_etat&code=' + codePartie, function(etat) {
            if (!etat.en_attente) {
                clearInterval(intervalId);
                intervalId = null;
                mon_id = 0;
                demarrerPartie();
            }
        });
    }, 1000);
}

function montrerRejoindre() {
    hide('ecran_accueil');
    show('ecran_rejoindre');
    document.getElementById('erreur_code').textContent = '';
    document.getElementById('code_input').value = '';
    document.getElementById('code_input').focus();
}

function rejoindrePartie() {
    var code = document.getElementById('code_input').value.trim().toUpperCase();
    if (code.length < 4) {
        document.getElementById('erreur_code').textContent = 'Code trop court';
        return;
    }
    ajax('GET', 'server.php?action=rejoindre&code=' + code, function(r) {
        if (r.erreur) {
            document.getElementById('erreur_code').textContent = r.erreur;
        } else {
            codePartie = code;
            mon_id = r.joueur;
            hide('ecran_rejoindre');
            demarrerPartie();
        }
    });
}

function annulerPartie() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    codePartie = null;
    hide('ecran_creer');
    show('ecran_accueil');
}

function retourAccueil() {
    hide('ecran_rejoindre');
    show('ecran_accueil');
}

function demarrerPartie() {
    hide('ecran_creer');
    hide('ecran_accueil');
    hide('ecran_rejoindre');
    show('zone_jeu');
    document.getElementById('mon_role').innerHTML = "Joueur " + (mon_id + 1) + (mon_id == 0 ? " (Bas)" : " (Haut)");
    demarrerPolling();
}

function demarrerPolling() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(recupererEtat, 800);
    recupererEtat();
}

function recupererEtat() {
    if (!codePartie) return;
    ajax('GET', 'server.php?action=recuperer_etat&code=' + codePartie, function(etat) {
        afficher(etat);
    });
}

function envoyerCoup(trou) {
    ajax('GET', 'server.php?action=jouer&code=' + codePartie + '&trou=' + trou + '&joueur=' + mon_id, function(rep) {
        if (rep.erreur) {
            document.getElementById('message_erreur').innerHTML = rep.erreur;
            setTimeout(function() { document.getElementById('message_erreur').innerHTML = ""; }, 2000);
        } else {
            afficher(rep);
        }
    });
}

function recommencer() {
    ajax('GET', 'server.php?action=reset&code=' + codePartie, function() {
        recupererEtat();
    });
}

function ajax(method, url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function() {
        if (xhr.status == 200) callback(JSON.parse(xhr.responseText));
    };
    xhr.send();
}

function show(id) { document.getElementById(id).style.display = 'block'; }
function hide(id) { document.getElementById(id).style.display = 'none'; }
