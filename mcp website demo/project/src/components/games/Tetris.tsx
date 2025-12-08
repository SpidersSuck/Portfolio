import { useRef, useEffect, useState } from 'react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;
const COLORS = [
  '#000', '#fbbf24', '#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#f87171', '#f59e42'
];
const SHAPES = [
  [],
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

function randomPiece() {
  const type = Math.floor(Math.random() * 7) + 1;
  return {
    type,
    shape: SHAPES[type],
    x: Math.floor(COLS / 2) - 2,
    y: 0,
    rotation: 0,
  };
}

function rotate(shape: number[][]): number[][] {
  return shape[0].map((_: number, i: number) => shape.map((row: number[]) => row[i]).reverse());
}

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState(randomPiece());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      let newPiece = { ...piece };
      if (e.key === 'ArrowLeft') newPiece.x--;
      if (e.key === 'ArrowRight') newPiece.x++;
      if (e.key === 'ArrowDown') newPiece.y++;
      if (e.key === 'ArrowUp') newPiece.shape = rotate(newPiece.shape);
      if (!collides(newPiece, board)) setPiece(newPiece);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [piece, board, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      let newPiece = { ...piece, y: piece.y + 1 };
      if (!collides(newPiece, board)) {
        setPiece(newPiece);
      } else {
        // Merge piece
        const newBoard = board.map(row => [...row]);
        piece.shape.forEach((row, dy) => {
          row.forEach((cell, dx) => {
            if (cell) {
              const px = piece.x + dx;
              const py = piece.y + dy;
              if (py >= 0 && px >= 0 && px < COLS && py < ROWS) {
                newBoard[py][px] = piece.type;
              }
            }
          });
        });
        // Clear lines
        let lines = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
          if (newBoard[y].every(cell => cell)) {
            newBoard.splice(y, 1);
            newBoard.unshift(Array(COLS).fill(0));
            lines++;
          }
        }
        setScore(s => s + lines * 100);
        setBoard(newBoard);
        const next = randomPiece();
        if (collides(next, newBoard)) {
          setGameOver(true);
        } else {
          setPiece(next);
        }
      }
    }, 400);
    return () => clearInterval(interval);
  }, [piece, board, gameOver]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    // Draw board
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x]) {
          ctx.fillStyle = COLORS[board[y][x]];
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = '#222';
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
    // Draw piece
    piece.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          ctx.fillStyle = COLORS[piece.type];
          ctx.fillRect((piece.x + dx) * BLOCK_SIZE, (piece.y + dy) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = '#222';
          ctx.strokeRect((piece.x + dx) * BLOCK_SIZE, (piece.y + dy) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });
  }, [board, piece]);

  function collides(
    p: { shape: number[][]; x: number; y: number; type: number; rotation: number },
    brd: number[][]
  ): boolean {
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < p.shape[y].length; x++) {
        if (p.shape[y][x]) {
          const px = p.x + x;
          const py = p.y + y;
          if (px < 0 || px >= COLS || py >= ROWS || (py >= 0 && brd[py][px])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-2 text-[#6366f1]">Tetris</h2>
      <canvas
        ref={canvasRef}
        width={COLS * BLOCK_SIZE}
        height={ROWS * BLOCK_SIZE}
        className="border-2 border-[#6366f1] bg-[#18181b] rounded shadow-lg"
      />
      <div className="mt-2 text-lg text-[#e6eef6]">Score: {score}</div>
      {gameOver && <div className="mt-2 text-red-400 font-bold">Game Over</div>}
    </div>
  );
}
