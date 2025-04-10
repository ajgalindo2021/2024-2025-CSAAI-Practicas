const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
const player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50, speed: 5 };
const bullets = [];
const aliens = [];
const alienRows = 3;
const alienCols = 8;
const alienSpeed = 2;

// Crear alienígenas
for (let r = 0; r < alienRows; r++) {
    for (let c = 0; c < alienCols; c++) {
        aliens.push({ x: c * 60 + 30, y: r * 60 + 30, width: 40, height: 40 });
    }
}

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAliens() {
    ctx.fillStyle = "green";
    aliens.forEach(alien => ctx.fillRect(alien.x, alien.y, alien.width, alien.height));
}

function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

function moveAliens() {
    let direction = alienSpeed;
    aliens.forEach(alien => {
        alien.x += direction;
    });

    if (aliens.some(alien => alien.x + alien.width > canvas.width || alien.x < 0)) {
        alienSpeed *= -1;
        aliens.forEach(alien => alien.y += 20);
    }
}

function detectCollisions() {
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach((alien, aIndex) => {
            if (bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {
                
                bullets.splice(bIndex, 1);
                aliens.splice(aIndex, 1);
                score += 10;
                document.getElementById("score").innerText = "Puntuación: " + score;
            }
        });
    });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAliens();
    drawBullets();
    moveBullets();
    moveAliens();
    detectCollisions();
    requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (event.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
    if (event.key === " ") bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
});

updateGame();
