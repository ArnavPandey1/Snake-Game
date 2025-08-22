let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let cellSize = 50;
let boardWidth = 1200;
let boardHeight = 800;
let snakeCells = [[0, 0], [50, 0]];
let direction = 'right';
let gameOver = false;
let foodCells = generateRandomFood();
let score = 0;
let id;

let buttonBox = { x: 500, y: 460, width: 200, height: 50 };

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && direction !== 'down') direction = "up";
  else if (event.key === 'ArrowDown' && direction !== 'up') direction = "down";
  else if (event.key === 'ArrowLeft' && direction !== 'right') direction = "left";
  else if (event.key === 'ArrowRight' && direction !== 'left') direction = "right";
});

canvas.addEventListener('click', function (e) {
  if (gameOver) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
      mouseX >= buttonBox.x &&
      mouseX <= buttonBox.x + buttonBox.width &&
      mouseY >= buttonBox.y &&
      mouseY <= buttonBox.y + buttonBox.height
    ) {
      restartGame();
    }
  }
});

function draw() {
  ctx.clearRect(0, 0, boardWidth, boardHeight);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "60px sans-serif";
    ctx.fillText('GAME OVER!!', 420, 320);

    // Score
    ctx.fillStyle = "white";
    ctx.font = "30px sans-serif";
    ctx.fillText(`Your Score: ${score}`, 480, 380);

    // Restart Button
    ctx.fillStyle = "darkolivegreen";
    ctx.fillRect(buttonBox.x, buttonBox.y, buttonBox.width, buttonBox.height);

    ctx.strokeStyle = "white";
    ctx.strokeRect(buttonBox.x, buttonBox.y, buttonBox.width, buttonBox.height);

    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText("Restart Game", buttonBox.x + 28, buttonBox.y + 33);
    return;
  }

  for (let cell of snakeCells) {
    ctx.fillStyle = "brown";
    ctx.fillRect(cell[0], cell[1], cellSize, cellSize);
    ctx.strokeStyle = "goldenrod";
    ctx.strokeRect(cell[0], cell[1], cellSize, cellSize);
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(foodCells[0], foodCells[1], cellSize, cellSize);

  ctx.fillStyle = "white";
  ctx.font = "24px monospace";
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function update() {
  if (gameOver) return;

  let headX = snakeCells[snakeCells.length - 1][0];
  let headY = snakeCells[snakeCells.length - 1][1];
  let newHeadX = headX;
  let newHeadY = headY;

  if (direction === 'up') newHeadY -= cellSize;
  else if (direction === 'down') newHeadY += cellSize;
  else if (direction === 'left') newHeadX -= cellSize;
  else if (direction === 'right') newHeadX += cellSize;

  if (
    newHeadX < 0 || newHeadY < 0 ||
    newHeadX >= boardWidth || newHeadY >= boardHeight ||
    ex(newHeadX, newHeadY)
  ) {
    gameOver = true;
    clearInterval(id);
    draw();
    return;
  }

  snakeCells.push([newHeadX, newHeadY]);

  if (newHeadX === foodCells[0] && newHeadY === foodCells[1]) {
    foodCells = generateRandomFood();
    score += 1;
  } else {
    snakeCells.shift();
  }
}

function generateRandomFood() {
  return [
    Math.floor(Math.random() * (boardWidth / cellSize)) * cellSize,
    Math.floor(Math.random() * (boardHeight / cellSize)) * cellSize,
  ];
}

function ex(x, y) {
  return snakeCells.some(cell => cell[0] === x && cell[1] === y);
}

function restartGame() {
  snakeCells = [[0, 0], [50, 0]];
  direction = 'right';
  gameOver = false;
  foodCells = generateRandomFood();
  score = 0;
  clearInterval(id);
  id = setInterval(gameLoop, 150);
}

function gameLoop() {
  update();
  draw();
}

id = setInterval(gameLoop, 150);
