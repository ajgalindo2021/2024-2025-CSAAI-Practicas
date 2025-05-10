const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");
const nodeCountDisplay = document.getElementById("nodeCount");
const totalTimeDisplay = document.getElementById("totalTime");
const messageDisplay = document.getElementById("message");

const nodeRadius = 40;
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100;
const numNodos = 5;

let redAleatoria = [];
let rutaMinimaConRetardos = [];

class Nodo {
  constructor(id, x, y, delay) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.delay = delay;
    this.conexiones = []; // conexiones: { id: <nodo_id>, peso: <peso> }
  }

  conectar(nodo, peso) {
    this.conexiones.push({ id: nodo.id, peso });
  }
}

function generarRed() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  redAleatoria = [];
  rutaMinimaConRetardos = [];

  // Crear nodos
  for (let i = 0; i < numNodos; i++) {
    const x = Math.random() * (canvas.width - 2 * nodeRadius) + nodeRadius;
    const y = Math.random() * (canvas.height - 2 * nodeRadius) + nodeRadius;
    const delay = Math.floor(Math.random() * nodeRandomDelay) + 100;
    redAleatoria.push(new Nodo(i, x, y, delay));
  }

  // Crear conexiones
  for (let i = 0; i < redAleatoria.length; i++) {
    let conexiones = 0;
    let intentos = 0;

    while (conexiones < nodeConnect && intentos < 20) {
      const target = Math.floor(Math.random() * numNodos);
      if (
        target !== i &&
        !redAleatoria[i].conexiones.some(c => c.id === target)
      ) {
        const peso = Math.floor(Math.random() * pipeRandomWeight) + 10;
        redAleatoria[i].conectar(redAleatoria[target], peso);
        redAleatoria[target].conectar(redAleatoria[i], peso);
        conexiones++;
      }
      intentos++;
    }
  }

  dibujarRed();
  nodeCountDisplay.textContent = redAleatoria.length;
  totalTimeDisplay.textContent = "-";
  messageDisplay.textContent = "Red generada correctamente.";
}

function dibujarRed(ruta = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar conexiones
  redAleatoria.forEach(nodo => {
    nodo.conexiones.forEach(conexion => {
      const targetNode = redAleatoria.find(n => n.id === conexion.id);
      ctx.beginPath();
      ctx.moveTo(nodo.x, nodo.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.strokeStyle = "#aaa";
      ctx.stroke();

      const midX = (nodo.x + targetNode.x) / 2;
      const midY = (nodo.y + targetNode.y) / 2;
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(`${conexion.peso}`, midX, midY);
    });
  });

  // Dibujar nodos
  redAleatoria.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
    const isRuta = ruta.includes(nodo.id);
    ctx.fillStyle = isRuta ? "green" : "blue";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`ID: ${nodo.id}`, nodo.x, nodo.y - 5);
    ctx.fillText(`D: ${nodo.delay}ms`, nodo.x, nodo.y + 15);
  });
}

function calcularRuta() {
  if (redAleatoria.length === 0) {
    messageDisplay.textContent = "Primero genera una red.";
    return;
  }

  const nodoInicio = redAleatoria[0];
  const nodoFin = redAleatoria[redAleatoria.length - 1];

  const resultado = dijkstraConRetardos(redAleatoria, nodoInicio, nodoFin);

  if (!resultado.ruta || resultado.ruta.length === 0) {
    messageDisplay.textContent = "No se encontró una ruta.";
    return;
  }

  // Recuperar objetos Nodo desde los IDs devueltos
  rutaMinimaConRetardos = resultado.ruta.map(id => redAleatoria.find(n => n.id === id));

  const totalDelay = rutaMinimaConRetardos.reduce((sum, nodo) => sum + nodo.delay, 0);
  totalTimeDisplay.textContent = totalDelay;
  messageDisplay.textContent = "Ruta mínima calculada correctamente.";

  dibujarRed(rutaMinimaConRetardos.map(n => n.id));
}

btnCNet.addEventListener("click", generarRed);
btnMinPath.addEventListener("click", calcularRuta);
