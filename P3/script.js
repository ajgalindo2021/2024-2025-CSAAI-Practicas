// Seleccionamos el canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "nave.png";  // Reemplaza con la ruta de tu imagen

const alienImg = new Image();
alienImg.src = "alien.png";  // Reemplaza con la ruta de tu imagen

// Ajustamos el tamaño del canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variable para la puntuación
let score = 0;

// Objeto que representa la nave del jugador
const player = {
    x: canvas.width / 2 - 25,  // Posición inicial en el centro
    y: canvas.height - 100,     // Posición cerca de la parte inferior
    width: 80,                 // Ancho de la nave
    height: 80,                // Altura de la nave
    speed: 10                   // Velocidad de movimiento
};

// Arreglos para las balas y los alienígenas
const bullets = [];
const aliens = [];

// Configuración de los alienígenas
const alienRows = 3;   // Número de filas de alienígenas
const alienCols = 8;   // Número de columnas de alienígenas
let alienSpeedX = 5;   // Velocidad horizontal de los alienígenas
let alienSpeedY = 20;  // Distancia que bajan cuando tocan los bordes

// Crear los alienígenas al inicio
for (let r = 0; r < alienRows; r++) {
    for (let c = 0; c < alienCols; c++) {
        aliens.push({
            x: c * 80 + 30, // Espaciado entre los alienígenas
            y: r * 70 + 30, // Altura inicial de cada fila
            width: 60,      // Ancho de los alienígenas
            height: 60      // Altura de los alienígenas
        });
    }
}


let isRotating = false; // Variable para controlar la rotación

function drawPlayer() {
    ctx.save(); // Guarda el estado actual del canvas
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2); // Mueve el origen al centro de la nave

    if (isRotating) {
        ctx.rotate(Math.PI / 2);  // Rota 90 grados (PI/2 radianes)
    }

    ctx.drawImage(playerImg, -player.width / 2, -player.height / 2, player.width, player.height); // Dibuja la nave centrada

    ctx.restore(); // Restaura el estado del canvas
}

// Detectar disparo y aplicar rotación
document.addEventListener("keydown", (event) => {
    if (event.key === " " && Date.now() - lastShotTime > shootDelay) {
        lastShotTime = Date.now(); // Registra el tiempo del último disparo
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10
        });

        isRotating = true; // Activa la rotación de la nave
        setTimeout(() => {
            isRotating = false; // Vuelve la nave a la posición normal después de 200 ms
        }, 200);
    }
});

// Dibuja los alienígenas en pantalla
function drawAliens() {
    aliens.forEach(alien => {
        ctx.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
    });
}

let lastShotTime = 0;  // Tiempo del último disparo
const shootDelay = 300;  // Delay entre disparos en milisegundos (300 ms = 0.3 segundos)

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed; // Mueve la nave a la izquierda
    }
    if (event.key === "ArrowRight" && player.x + player.width < canvas.width) {
        player.x += player.speed; // Mueve la nave a la derecha
    }

    if (event.key === " " && Date.now() - lastShotTime > shootDelay) {
        lastShotTime = Date.now(); // Registra el tiempo del último disparo
        // Dispara una bala desde la nave
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10
        });
    }
});


// Dibuja las balas disparadas
function drawBullets() {
    ctx.fillStyle = "red"; // Marcador temporal (reemplazar con imagen)
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

// Mueve las balas hacia arriba y las elimina si salen del canvas
function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 10;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

// Mueve los alienígenas de lado a lado y los hace bajar cuando tocan los bordes
function moveAliens() {
    let shouldMoveDown = false;

    // Mueve todos los alienígenas en la dirección actual
    aliens.forEach(alien => {
        alien.x += alienSpeedX;
    });

    // Verifica si algún alien toca los bordes del canvas
    for (let alien of aliens) {
        if (alien.x + alien.width >= canvas.width || alien.x <= 0) {
            shouldMoveDown = true;
            break; // No hace falta seguir verificando
        }
    }

    // Si algún alien toca un borde, todos bajan y cambian de dirección
    if (shouldMoveDown) {
        aliens.forEach(alien => {
            alien.y += alienSpeedY;
        });
        alienSpeedX *= -1; // Invierte la dirección horizontal
    }
}

// Detecta colisiones entre balas y alienígenas
function detectCollisions() {
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach((alien, aIndex) => {
            if (bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {
                
                // Eliminar la bala y el alienígena
                bullets.splice(bIndex, 1);
                aliens.splice(aIndex, 1);

                // Sumar 10 puntos al marcador
                score += 10;
                document.getElementById("score").innerText = "Puntuación: " + score;
            }
        });
    });
}

// Función principal que actualiza el juego en cada frame
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia la pantalla
    drawPlayer();    // Dibuja la nave
    drawAliens();    // Dibuja los alienígenas
    drawBullets();   // Dibuja las balas
    moveBullets();   // Mueve las balas
    moveAliens();    // Mueve los alienígenas
    detectCollisions(); // Verifica si hay impactos
    requestAnimationFrame(updateGame); // Repite la función en el siguiente frame
}

// Manejo del teclado para mover la nave y disparar
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed; // Mueve la nave a la izquierda
    }
    if (event.key === "ArrowRight" && player.x + player.width < canvas.width) {
        player.x += player.speed; // Mueve la nave a la derecha
    }
    if (event.key === " ") {
        // Dispara una bala desde la nave
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10
        });
    }
});

// Iniciar el bucle del juego
updateGame();
