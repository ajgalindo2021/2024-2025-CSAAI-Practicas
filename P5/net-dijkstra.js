/* jshint esversion: 6 */
function dijkstraConRetardos(red, origen, destino) {
  const distancia = {};
  const anterior = {};
  const nodosNoVisitados = new Set();

  for (const nodo of red) {
      distancia[nodo.id] = Infinity;
      anterior[nodo.id] = null;
      nodosNoVisitados.add(nodo.id);
  }

  distancia[origen.id] = 0;

  while (nodosNoVisitados.size > 0) {
      let nodoActual = null;
      for (const nodoId of nodosNoVisitados) {
          if (nodoActual === null || distancia[nodoId] < distancia[nodoActual]) {
              nodoActual = nodoId;
          }
      }

      if (nodoActual === null) break;

      nodosNoVisitados.delete(nodoActual);

      const nodoObj = red.find(n => n.id === nodoActual);

      for (const { id: vecinoId, peso } of nodoObj.conexiones) {
          const vecinoObj = red.find(n => n.id === vecinoId);
          const distanciaTotal = distancia[nodoActual] + vecinoObj.delay;


          if (distanciaTotal < distancia[vecinoId]) {
              distancia[vecinoId] = distanciaTotal;
              anterior[vecinoId] = nodoActual;
          }
      }
  }

  const rutaMinima = [];
  let actual = destino.id;

  while (anterior[actual] !== null) {
      rutaMinima.unshift(actual);
      actual = anterior[actual];
  }

  if (actual === origen.id) {
      rutaMinima.unshift(origen.id);
      return { ruta: rutaMinima };
  } else {
      return { ruta: [] };
  }
}
