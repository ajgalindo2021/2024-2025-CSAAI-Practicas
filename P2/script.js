//-- Clase Crono
class Crono {
    constructor(display) {
        this.display = display;
        this.cent = 0; // Centésimas
        this.seg = 0;  // Segundos
        this.min = 0;  // Minutos
        this.timer = 0; // Temporizador asociado
    }

    //-- Método que se ejecuta cada centésima
    tic() {
        this.cent += 1;

        if (this.cent == 100) { 
            this.seg += 1; 
            this.cent = 0; 
        }

        if (this.seg == 60) { 
            this.min += 1; 
            this.seg = 0; 
        }

        this.display.innerHTML = `${this.min}:${this.seg}:${this.cent}`;
    }

    //-- Arrancar el cronómetro
    start() {
       if (!this.timer) {
          this.timer = setInterval(() => this.tic(), 10);
        }
    }

    //-- Parar el cronómetro
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    //-- Reset del cronómetro
    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        this.display.innerHTML = "0:0:0";
    }
}

//-- Instancia del cronómetro con el `span` del HTML
const cronometro = new Crono(document.getElementById("cronometro"));

//-- Modificación del código del juego
let claveSecreta = "";
let intentosRestantes = 10;
let juegoActivo = false;
let claveMostrada = ["?", "?", "?", "?"];

// Generar clave secreta
function generarClave() {
    claveSecreta = "";
    claveMostrada = ["?", "?", "?", "?"];
    for (let i = 0; i < 4; i++) {
        claveSecreta += Math.floor(Math.random() * 10);
    }
    actualizarClaveMostrada();
    console.log("Clave generada:", claveSecreta);
}

// Mostrar clave parcialmente descubierta
function actualizarClaveMostrada() {
    document.getElementById("clave-secreta").textContent = claveMostrada.join("");
}

// Iniciar el juego con el cronómetro
document.getElementById("start").addEventListener("click", function () {
    if (!juegoActivo) {
        generarClave();
        intentosRestantes = 10;
        document.getElementById("intentos").textContent = intentosRestantes;
        document.getElementById("entrada").value = "";
        cronometro.reset(); // Reinicia el cronómetro
        cronometro.start(); // Inicia el cronómetro
        juegoActivo = true;
    }
});

// Detener el juego y cronómetro
document.getElementById("stop").addEventListener("click", function () {
    cronometro.stop();
    juegoActivo = false;
});

// Reiniciar juego y cronómetro
document.getElementById("reset").addEventListener("click", function () {
    cronometro.stop();
    cronometro.reset();
    juegoActivo = false;
    document.getElementById("entrada").value = "";
    document.getElementById("clave-secreta").textContent = "????";
    intentosRestantes = 10;
    document.getElementById("intentos").textContent = intentosRestantes;
});

// Botones numéricos
document.querySelectorAll(".num-btn").forEach(button => {
    button.addEventListener("click", function () {
        let entrada = document.getElementById("entrada");
        if (entrada.value.length < 4) {
            entrada.value += this.textContent;
        }
    });
});

// Borrar último número
document.getElementById("borrar").addEventListener("click", function () {
    let entrada = document.getElementById("entrada");
    entrada.value = entrada.value.slice(0, -1);
});

// Verificar clave ingresada
document.getElementById("verificar").addEventListener("click", function () {
    let entrada = document.getElementById("entrada").value;
    if (entrada.length < 4) {
        alert("Introduce una clave de 4 dígitos.");
        return;
    }

    let coincidencias = 0;

    for (let i = 0; i < 4; i++) {
        if (entrada[i] === claveSecreta[i]) {
            claveMostrada[i] = claveSecreta[i];
            coincidencias++;
        }
    }

    actualizarClaveMostrada();

    if (coincidencias === 4) {
        alert(`🎉 ¡Felicidades! Adivinaste la clave en ${cronometro.min}:${cronometro.seg}:${cronometro.cent}`);
        cronometro.stop();
        juegoActivo = false;
    } else {
        intentosRestantes--;
        document.getElementById("intentos").textContent = intentosRestantes;
        if (intentosRestantes === 0) {
            alert(`😞 Se acabaron los intentos. La clave era: ${claveSecreta}`);
            document.getElementById("clave-secreta").textContent = claveSecreta;
            cronometro.stop();
            juegoActivo = false;
        } else {
            document.getElementById("entrada").value = "";
        }
    }
});
