<?php
// ===================================================
// Auteur: AKANA SIGNING JOSIAS AARON | Matricule: 24H2358
// Fichier: server.php (v2_remote) - Serveur PHP pour XAMPP
// Gere la logique du jeu: semaille, prises, tours, fin de partie.
// ===================================================

header('Content-Type: application/json');
$fichier = 'state.json';

// --- INITIALISATION OU RESET ---
if (!file_exists($fichier) || (isset($_GET['action']) && $_GET['action'] == 'reset')) {
    $init = array(
        "le_plateau" => array(5,5,5,5,5,5,5, 5,5,5,5,5,5,5),
        "les_scores" => array(0, 0),
        "joueur_qui_joue" => 0,
        "le_gagnant" => null
    );
    file_put_contents($fichier, json_encode($init));
    if (isset($_GET['action']) && $_GET['action'] == 'reset') {
        echo json_encode(array("statut" => "ok"));
        exit;
    }
}

// Lire l'etat
$etat = json_decode(file_get_contents($fichier), true);

// --- RECUPERER L'ETAT ---
if (isset($_GET['action']) && $_GET['action'] == 'recuperer_etat') {
    echo json_encode($etat);
    exit;
}

// --- JOUER ---
if (isset($_GET['action']) && $_GET['action'] == 'jouer') {
    $trou = intval($_GET['trou']);
    $joueur = intval($_GET['joueur']);

    // Validations
    if ($etat['le_gagnant'] !== null) { echo json_encode(array("erreur" => "Jeu fini!")); exit; }
    if ($joueur != $etat['joueur_qui_joue']) { echo json_encode(array("erreur" => "Pas ton tour!")); exit; }
    if ($etat['le_plateau'][$trou] == 0) { echo json_encode(array("erreur" => "Trou vide!")); exit; }
    if ($joueur == 0 && $trou > 6) { echo json_encode(array("erreur" => "Joue dans ton camp!")); exit; }
    if ($joueur == 1 && $trou < 7) { echo json_encode(array("erreur" => "Joue dans ton camp!")); exit; }

    $plateau = $etat['le_plateau'];
    $scores = $etat['les_scores'];
    $suivant = array(7,0,1,2,3,4,5, 8,9,10,11,12,13,6);
    $precedent = array(1,2,3,4,5,6,13, 0,7,8,9,10,11,12);

    // Semaille
    $n = $plateau[$trou];
    $plateau[$trou] = 0;
    $pos = $trou;
    while ($n > 0) {
        $pos = $suivant[$pos];
        if ($pos == $trou) continue;
        $plateau[$pos]++;
        $n--;
    }

    // Prises
    $chezAdv = ($joueur == 0 && $pos >= 7) || ($joueur == 1 && $pos <= 6);
    $interdit = ($joueur == 0) ? 7 : 0;

    if ($chezAdv) {
        $p = $pos; $total = 0;
        while (true) {
            $encore = ($joueur == 0 && $p >= 7) || ($joueur == 1 && $p <= 6);
            if (!$encore) break;
            $g = $plateau[$p];
            if ($g >= 2 && $g <= 4) {
                if ($p == $interdit && $total == 0) break;
                $total += $g;
                $plateau[$p] = 0;
            } else break;
            $p = $precedent[$p];
        }
        $scores[$joueur] += $total;
    }

    // Fin de partie
    $reste = array_sum($plateau);
    if ($reste < 10 || $scores[0] >= 40 || $scores[1] >= 40) {
        for ($i = 0; $i <= 6; $i++) { $scores[0] += $plateau[$i]; $plateau[$i] = 0; }
        for ($i = 7; $i <= 13; $i++) { $scores[1] += $plateau[$i]; $plateau[$i] = 0; }
        $etat['le_gagnant'] = ($scores[0] > $scores[1]) ? 0 : (($scores[1] > $scores[0]) ? 1 : -1);
    }

    // Mise a jour
    $etat['le_plateau'] = $plateau;
    $etat['les_scores'] = $scores;
    if ($etat['le_gagnant'] === null) $etat['joueur_qui_joue'] = 1 - $joueur;

    file_put_contents($fichier, json_encode($etat));
    echo json_encode($etat);
    exit;
}

// Action inconnue
echo json_encode(array("erreur" => "Action inconnue"));
