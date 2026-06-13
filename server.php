<?php
header('Content-Type: application/json');
if (!is_dir('rooms')) mkdir('rooms', 0777, true);
$action = $_GET['action'] ?? '';

// --- CREER UNE PARTIE ---
if ($action == 'creer') {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $code = '';
    for ($i = 0; $i < 6; $i++) $code .= $chars[rand(0, strlen($chars) - 1)];
    $fichier = 'rooms/' . $code . '.json';
    if (!is_dir('rooms')) mkdir('rooms', 0777, true);
    $init = array(
        "le_plateau" => array(5,5,5,5,5,5,5, 5,5,5,5,5,5,5),
        "les_scores" => array(0, 0),
        "joueur_qui_joue" => 0,
        "le_gagnant" => null,
        "joueurs" => array(true, false)
    );
    file_put_contents($fichier, json_encode($init));
    echo json_encode(array("code" => $code));
    exit;
}

$code = $_GET['code'] ?? '';
$fichier = 'rooms/' . $code . '.json';

// --- REJOINDRE UNE PARTIE ---
if ($action == 'rejoindre') {
    if (!file_exists($fichier)) { echo json_encode(array("erreur" => "Code invalide!")); exit; }
    $etat = json_decode(file_get_contents($fichier), true);
    if ($etat['joueurs'][0] && $etat['joueurs'][1]) { echo json_encode(array("erreur" => "Partie pleine!")); exit; }
    $joueur = $etat['joueurs'][0] ? 1 : 0;
    $etat['joueurs'][$joueur] = true;
    file_put_contents($fichier, json_encode($etat));
    echo json_encode(array("joueur" => $joueur));
    exit;
}

if (!file_exists($fichier)) { echo json_encode(array("erreur" => "Partie introuvable")); exit; }
$etat = json_decode(file_get_contents($fichier), true);
$en_attente = !$etat['joueurs'][0] || !$etat['joueurs'][1];

// --- RECUPERER L'ETAT ---
if ($action == 'recuperer_etat') {
    $retour = $etat;
    $retour['en_attente'] = $en_attente;
    echo json_encode($retour);
    exit;
}

// --- RESET ---
if ($action == 'reset') {
    $init = array(
        "le_plateau" => array(5,5,5,5,5,5,5, 5,5,5,5,5,5,5),
        "les_scores" => array(0, 0),
        "joueur_qui_joue" => 0,
        "le_gagnant" => null,
        "joueurs" => $etat['joueurs']
    );
    file_put_contents($fichier, json_encode($init));
    echo json_encode(array("statut" => "ok"));
    exit;
}

// --- JOUER ---
if ($action == 'jouer') {
    $trou = intval($_GET['trou']);
    $joueur = intval($_GET['joueur']);

    if ($en_attente) { echo json_encode(array("erreur" => "En attente du second joueur...")); exit; }
    if ($etat['le_gagnant'] !== null) { echo json_encode(array("erreur" => "Jeu fini!")); exit; }
    if ($joueur != $etat['joueur_qui_joue']) { echo json_encode(array("erreur" => "Pas ton tour!")); exit; }
    if ($etat['le_plateau'][$trou] == 0) { echo json_encode(array("erreur" => "Trou vide!")); exit; }
    if ($joueur == 0 && $trou > 6) { echo json_encode(array("erreur" => "Joue dans ton camp!")); exit; }
    if ($joueur == 1 && $trou < 7) { echo json_encode(array("erreur" => "Joue dans ton camp!")); exit; }

    $plateau = $etat['le_plateau'];
    $scores = $etat['les_scores'];
    $suivant = array(7,0,1,2,3,4,5, 8,9,10,11,12,13,6);
    $precedent = array(1,2,3,4,5,6,13, 0,7,8,9,10,11,12);

    $n = $plateau[$trou];
    $plateau[$trou] = 0;
    $pos = $trou;
    while ($n > 0) {
        $pos = $suivant[$pos];
        if ($pos == $trou) continue;
        $plateau[$pos]++;
        $n--;
    }

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

    $reste = array_sum($plateau);
    if ($reste < 10 || $scores[0] >= 40 || $scores[1] >= 40) {
        for ($i = 0; $i <= 6; $i++) { $scores[0] += $plateau[$i]; $plateau[$i] = 0; }
        for ($i = 7; $i <= 13; $i++) { $scores[1] += $plateau[$i]; $plateau[$i] = 0; }
        $etat['le_gagnant'] = ($scores[0] > $scores[1]) ? 0 : (($scores[1] > $scores[0]) ? 1 : -1);
    }

    $etat['le_plateau'] = $plateau;
    $etat['les_scores'] = $scores;
    if ($etat['le_gagnant'] === null) $etat['joueur_qui_joue'] = 1 - $joueur;

    file_put_contents($fichier, json_encode($etat));
    echo json_encode($etat);
    exit;
}

echo json_encode(array("erreur" => "Action inconnue"));
