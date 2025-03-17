let claveSecreta = "";
let intentosRestantes = 10;
let tiempo = 0;
let intervalo;
let juegoActivo = false;
let claveMostrada = ["?", "?", "?", "?"]; // Inicialmente todos los caracteres son "?"

// Generar una clave secreta aleatoria de 4 dígitos
function generarClave() {
    claveSecreta = "";
    claveMostrada = ["?", "?", "?", "?"]; // Reiniciar la clave mostrada
    for (let i = 0; i < 4; i++) {
        claveSecreta += Math.floor(Math.random() * 10); // Números del 0 al 9
    }
    actualizarClaveMostrada();
    console.log("Clave generada:", claveSecreta); // Para depuración en consola
}

// Actualizar la clave mostrada en pantalla
function actualizarClaveMostrada() {
    document.getElementById("clave-secreta").textContent = claveMostrada.join("");
}

// Iniciar el juego
document.getElementById("start").addEventListener("click", function () {
    if (!juegoActivo) {
        generarClave();
        intentosRestantes = 10;
        tiempo = 0;
        document.getElementById("intentos").textContent = intentosRestantes;
        document.getElementById("entrada").value = "";
        juegoActivo = true;
        intervalo = setInterval(() => {
            tiempo++;
            document.getElementById("contador").textContent = tiempo;
        }, 1000);
    }
});

// Detener el tiempo
document.getElementById("stop").addEventListener("click", function () {
    clearInterval(intervalo);
    juegoActivo = false;
});

// Reiniciar el juego
document.getElementById("reset").addEventListener("click", function () {
    clearInterval(intervalo);
    juegoActivo = false;
    tiempo = 0;
    document.getElementById("contador").textContent = tiempo;
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

// Verificar la clave ingresada
document.getElementById("verificar").addEventListener("click", function () {
    let entrada = document.getElementById("entrada").value;
    if (entrada.length < 4) {
        alert("Introduce una clave de 4 dígitos.");
        return;
    }

    let coincidencias = 0;

    // Verificar cada número en su posición
    for (let i = 0; i < 4; i++) {
        if (entrada[i] === claveSecreta[i]) {
            claveMostrada[i] = claveSecreta[i]; // Mostrar número correcto
            coincidencias++;
        }
    }

    actualizarClaveMostrada(); // Actualizar clave con números revelados

    if (coincidencias === 4) {
        alert("🎉 ¡Felicidades! Adivinaste la clave en " + tiempo + " segundos.");
        clearInterval(intervalo);
        juegoActivo = false;
    } else {
        intentosRestantes--;
        document.getElementById("intentos").textContent = intentosRestantes;
        if (intentosRestantes === 0) {
            alert("😞 Se acabaron los intentos. La clave era: " + claveSecreta);
            document.getElementById("clave-secreta").textContent = claveSecreta;
            clearInterval(intervalo);
            juegoActivo = false;
        } else {
            alert("❌ Algunos números son incorrectos. Sigue intentando.");
            document.getElementById("entrada").value = "";
        }
    }
});
