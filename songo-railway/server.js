const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOARD_SIZE = 14;
const SEEDS_PER_HOLE = 5;
const WIN_SCORE = 40;
const END_THRESHOLD = 10;

const nextPos = [7,0,1,2,3,4,5, 8,9,10,11,12,13,6];
const prevPos = [1,2,3,4,5,6,13, 0,7,8,9,10,11,12];

let gameState = createInitialState();

function createInitialState() {
  return {
    board: Array(BOARD_SIZE).fill(SEEDS_PER_HOLE),
    scores: [0, 0],
    currentPlayer: 0,
    winner: null
  };
}

function playTurn(state, player, hole) {
  hole = parseInt(hole);

  if (state.winner !== null) return { error: "Jeu fini!" };
  if (player !== state.currentPlayer) return { error: "Pas ton tour!" };
  if (state.board[hole] === 0) return { error: "Trou vide!" };
  if (player === 0 && (hole < 0 || hole > 6)) return { error: "Joue dans ton camp!" };
  if (player === 1 && (hole < 7 || hole > 13)) return { error: "Joue dans ton camp!" };

  const board = [...state.board];
  const scores = [...state.scores];
  let seeds = board[hole];
  board[hole] = 0;
  let pos = hole;

  while (seeds > 0) {
    pos = nextPos[pos];
    if (pos === hole) continue;
    board[pos]++;
    seeds--;
  }

  const inOpponent = (player === 0 && pos >= 7) || (player === 1 && pos <= 6);
  const forbidden = player === 0 ? 7 : 0;

  if (inOpponent) {
    let p = pos;
    let total = 0;

    while (true) {
      const stillOpponent = (player === 0 && p >= 7) || (player === 1 && p <= 6);
      if (!stillOpponent) break;

      const count = board[p];
      if (count >= 2 && count <= 4) {
        if (p === forbidden && total === 0) break;
        total += count;
        board[p] = 0;
      } else break;

      p = prevPos[p];
    }

    scores[player] += total;
  }

  const remaining = board.reduce((a, b) => a + b, 0);
  if (remaining < END_THRESHOLD || scores[0] >= WIN_SCORE || scores[1] >= WIN_SCORE) {
    for (let i = 0; i <= 6; i++) { scores[0] += board[i]; board[i] = 0; }
    for (let i = 7; i <= 13; i++) { scores[1] += board[i]; board[i] = 0; }
    state.winner = scores[0] > scores[1] ? 0 : (scores[1] > scores[0] ? 1 : -1);
  }

  state.board = board;
  state.scores = scores;

  if (state.winner === null) {
    state.currentPlayer = 1 - player;
  }

  return null;
}

app.get('/api/state', (req, res) => {
  res.json(gameState);
});

app.post('/api/reset', (req, res) => {
  gameState = createInitialState();
  res.json({ statut: "ok" });
});

app.post('/api/move', (req, res) => {
  const { player, hole } = req.body;
  const err = playTurn(gameState, player, hole);
  if (err) {
    res.status(400).json(err);
  } else {
    res.json(gameState);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Songo server running on port ${PORT}`);
});
