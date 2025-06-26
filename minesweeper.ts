import readline from 'readline';

type Cell = boolean; // true = bombe, false = vide
type Grid = Cell[][];
type VisibleCell = 'hidden' | 'revealed' | 'bomb';
type VisibleGrid = VisibleCell[][];

function generateGrid(rows: number, cols: number, bombs: number): Grid {
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );

  let placed = 0;
  while (placed < bombs) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!grid[row][col]) {
      grid[row][col] = true;
      placed++;
    }
  }

  return grid;
}

function createVisibleGrid(rows: number, cols: number): VisibleGrid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'hidden')
  );
}

function printVisibleGrid(visible: VisibleGrid): void {
  for (const row of visible) {
    console.log(
      row
        .map(cell => {
          if (cell === 'hidden') return '⬛';
          if (cell === 'bomb') return '💣';
          return '⬜';
        })
        .join(' ')
    );
  }
}

function askForCoordinates(callback: (row: number, col: number) => void) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Entrez les coordonnées (ex: 2 3) : ', answer => {
    const [rowStr, colStr] = answer.trim().split(' ');
    const row = parseInt(rowStr, 10);
    const col = parseInt(colStr, 10);
    rl.close();
    callback(row, col);
  });
}

function playGame(rows = 5, cols = 5, bombs = 5) {
  const hiddenGrid = generateGrid(rows, cols, bombs);
  const visibleGrid = createVisibleGrid(rows, cols);

  function loop() {
    printVisibleGrid(visibleGrid);
    askForCoordinates((row, col) => {
      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        console.log("❌ Coordonnées invalides !");
        return loop();
      }

      if (visibleGrid[row][col] !== 'hidden') {
        console.log("⚠️ Case déjà révélée !");
        return loop();
      }

      if (hiddenGrid[row][col]) {
        visibleGrid[row][col] = 'bomb';
        printVisibleGrid(visibleGrid);
        console.log("💥 BOOM ! Tu as perdu.");
        return;
      } else {
        visibleGrid[row][col] = 'revealed';
        return loop();
      }
    });
  }

  loop();
}

playGame();
