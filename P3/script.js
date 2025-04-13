// Seleccionamos el canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cargar imágenes
const playerImg = new Image();
playerImg.src = "nave.png"; 

const alienImg = new Image();
alienImg.src = "alien.png"; 

const explosionImg = new Image();
explosionImg.src = "explosion.png";  // Imagen de explosión

// Cargar sonidos
const shootSound = new Audio("disparo.mp3");  // Sonido de disparo+
const explosionSound = new Audio("explosion.mp3");  // Sonido de explosión+
const victorySound = new Audio("victoria.mp3");  // Sonido de victoria+
const gameOverSound = new Audio("gameover.mp3");  // Sonido de game over

// Ajustamos el tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables de juego
let score = 0;
let gameOver = false;

// Objeto del jugador
const player = {
    x: canvas.width / 2 - 25,  
    y: canvas.height - 100,    
    width: 80,                 
    height: 80,                
    speed: 10                  
};

// Balas y alienígenas
const bullets = [];
const aliens = [];
const explosions = [];  // Array para manejar las explosiones

// Configuración de los alienígenas
const alienRows = 3;
const alienCols = 8;
let alienSpeedX = 5;
let alienSpeedY = 20;

// Crear alienígenas
for (let r = 0; r < alienRows; r++) {
    for (let c = 0; c < alienCols; c++) {
        aliens.push({
            x: c * 80 + 30, 
            y: r * 70 + 30, 
            width: 60,      
            height: 60      
        });
    }
}

let isRotating = false;
let lastShotTime = 0;
const shootDelay = 300;

// Dibujar jugador
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    if (isRotating) ctx.rotate(Math.PI / 2);
    ctx.drawImage(playerImg, -player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();
}

// Dibujar alienígenas
function drawAliens() {
    aliens.forEach(alien => ctx.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height));
}

// Dibujar balas
function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

// Dibujar explosiones
function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        let explosion = explosions[i];
        ctx.drawImage(explosionImg, explosion.x, explosion.y, 60, 60);
        explosion.frames--;
        if (explosion.frames <= 0) explosions.splice(i, 1);  // Eliminar después de 15 frames
    }
}

// Mover balas
function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 15;
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }
}

// Mover alienígenas
function moveAliens() {
    let shouldMoveDown = false;

    for (let alien of aliens) {
        alien.x += alienSpeedX;
        if (alien.x + alien.width >= canvas.width || alien.x <= 0) shouldMoveDown = true;
    }

    if (shouldMoveDown) {
        for (let alien of aliens) {
            alien.y += alienSpeedY;
            if (alien.y + alien.height >= player.y) endGame(false); // Si llegan al jugador, game over
        }
        alienSpeedX *= -1;
    }
}

function playShootSound() {
    const shoot = new Audio("disparo.mp3");
    shoot.volume = 0.5; // Opcional
    shoot.play();
}

function playExplosionSound() {
    const explosion = new Audio("explosion.mp3");
    explosion.volume = 0.5; // Opcional
    explosion.play();
}


// Detectar colisiones
function detectCollisions() {
    for (let b = bullets.length - 1; b >= 0; b--) {
        for (let a = aliens.length - 1; a >= 0; a--) {
            let bullet = bullets[b];
            let alien = aliens[a];

            if (
                bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y
            ) {
                explosions.push({ x: alien.x, y: alien.y, frames: 15 }); // Agregar explosión
                playExplosionSound();  // Sonido de explosión
                bullets.splice(b, 1);
                aliens.splice(a, 1);
                score += 10;
                document.getElementById("score").innerText = "Puntuación: " + score;
                break;
            }
        }
    }

    if (aliens.length === 0) endGame(true); // Si no quedan aliens, victoria
}

// Mostrar mensaje de final de juego
function endGame(victory) {
    gameOver = true;
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";

    if (victory) {
        ctx.fillText("¡Victoria! Has salvado a la humanidad 🎉", canvas.width / 2, canvas.height / 2);
        victorySound.play();
    } else {
        ctx.fillText("GAME OVER. La humanidad ha caído 💀", canvas.width / 2, canvas.height / 2);
        gameOverSound.play();
    }
}

// Función principal
function updateGame() {
    if (gameOver) return;  // Si termina el juego, no sigue

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAliens();
    drawBullets();
    drawExplosions();
    moveBullets();
    moveAliens();
    detectCollisions();
    requestAnimationFrame(updateGame);
}

// Manejo del teclado
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            if (player.x > 0) player.x -= player.speed;
            break;
        case "ArrowRight":
            if (player.x + player.width < canvas.width) player.x += player.speed;
            break;
        case " ":
            if (Date.now() - lastShotTime > shootDelay) {
                lastShotTime = Date.now();
                bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
                playShootSound();  // Sonido de disparo
                isRotating = true;
                setTimeout(() => { isRotating = false; }, 200);
            }
            break;
    }
});

// Iniciar juego
updateGame();

