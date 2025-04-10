// Seleccionamos el canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "nave.png";  // Reemplaza con tu imagen de la nave

const alienImg = new Image();
alienImg.src = "alien.png";  // Reemplaza con tu imagen de los alienígenas

// Ajustamos el tamaño del canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variable para la puntuación
let score = 0;

// Objeto que representa la nave del jugador
const player = {
    x: canvas.width / 2 - 25,  
    y: canvas.height - 100,    
    width: 80,                 
    height: 80,                
    speed: 10                  
};

// Arreglos para las balas y los alienígenas
const bullets = [];
const aliens = [];

// Configuración de los alienígenas
const alienRows = 3;
const alienCols = 8;
let alienSpeedX = 5;   
let alienSpeedY = 20;

// Crear los alienígenas al inicio
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

let isRotating = false; // Control de rotación de la nave
let lastShotTime = 0;  // Tiempo del último disparo
const shootDelay = 300;  // Delay entre disparos (en ms)

// Función para dibujar la nave
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

    if (isRotating) {
        ctx.rotate(Math.PI / 2);  // Rota 90° a la derecha
    }

    ctx.drawImage(playerImg, -player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore();
}

// Dibuja los alienígenas en pantalla
function drawAliens() {
    aliens.forEach(alien => {
        ctx.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
    });
}

// Dibuja las balas
function drawBullets() {
    ctx.fillStyle = "red"; 
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

// Mueve las balas hacia arriba y las elimina si salen del canvas
function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 15; // Aumentamos la velocidad de los disparos
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }
}

// Mueve los alienígenas y los hace bajar si tocan los bordes
function moveAliens() {
    let shouldMoveDown = false;

    for (let alien of aliens) {
        alien.x += alienSpeedX;

        if (alien.x + alien.width >= canvas.width || alien.x <= 0) {
            shouldMoveDown = true;
        }
    }

    if (shouldMoveDown) {
        for (let alien of aliens) {
            alien.y += alienSpeedY;
        }
        alienSpeedX *= -1; // Invierte la dirección horizontal
    }
}

// Detecta colisiones entre balas y alienígenas
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
                bullets.splice(b, 1);
                aliens.splice(a, 1);

                score += 10;
                document.getElementById("score").innerText = "Puntuación: " + score;
                break; // Evita eliminar más de un alien con una sola bala
            }
        }
    }
}

// Función principal del juego
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
                bullets.push({
                    x: player.x + player.width / 2 - 2.5,
                    y: player.y,
                    width: 5,
                    height: 10
                });

                isRotating = true;
                setTimeout(() => {
                    isRotating = false;
                }, 200);
            }
            break;
    }
});

// Iniciar el juego
updateGame();

