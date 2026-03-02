const fs = require('fs');

// Promedio de un arreglo
function promedio(numeros) {
  if (!Array.isArray(numeros) || numeros.length === 0) {
    return 0;
  }

  let suma = 0;
  for (let i = 0; i < numeros.length; i++) {
    suma += numeros[i];
  }

  return suma / numeros.length;
}

const arregloEjemplo = [220, 200, 300, 100, 50];
console.log('Arreglo:', arregloEjemplo);
console.log('Promedio:', promedio(arregloEjemplo));

// Escribir texto en archivo
function escribirArchivo(texto) {
  fs.writeFileSync('texto.txt', texto, 'utf8');
}

const textoEjemplo = ' Este es el archivo creado con Node.js';
escribirArchivo(textoEjemplo);
console.log('Archivo "texto.txt" creado correctamente.');

// Determinar si un número es primo
function esPrimo(numero) {
  if (numero <= 1) {
    return false;
  }

  for (let i = 2; i < numero; i++) {
    if (numero % i === 0) {
      return false;
    }
  }

  return true;
}

const numeroEjemplo = 7;
if (esPrimo(numeroEjemplo)) {
  console.log(numeroEjemplo + ' es primo.');
} else {
  console.log(numeroEjemplo + ' no es primo.');
}

