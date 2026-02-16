function problema1() {
  const entrada = prompt("Ingresa un número entero positivo:");
  const n = Number(entrada);

  if (!Number.isInteger(n) || n < 1) {
    alert("Entrada inválida. Debe ser un entero mayor o igual a 1.");
    return;
  }

  document.write("<h1>Tabla del 1 al " + n + "</h1>");
  document.write("<table border='1' cellpadding='6' cellspacing='0'>");
  document.write("<tr><th>Número</th><th>Cuadrado</th><th>Cubo</th></tr>");

  for (let i = 1; i <= n; i++) {
    document.write(
      "<tr><td>" + i + "</td><td>" + (i * i) + "</td><td>" + (i * i * i) + "</td></tr>"
    );
  }

  document.write("</table>");
}

function problema2() {
  const a = Math.floor(Math.random() * 100) + 1;
  const b = Math.floor(Math.random() * 100) + 1;
  const inicio = Date.now();
  const respuesta = prompt("¿Cuánto es " + a + " + " + b + "?");
  const fin = Date.now();
  const tiempoSeg = ((fin - inicio) / 1000).toFixed(2);

  const out = document.getElementById("outProblema2");

  if (respuesta === null) {
    out.textContent = "Operación cancelada por el usuario.";
    return;
  }

  const valor = Number(respuesta);
  const correcta = valor === a + b;

  out.textContent =
    "Operación: " + a + " + " + b + "\n" +
    "Tu respuesta: " + respuesta + "\n" +
    "Resultado: " + (correcta ? "Correcto" : "Incorrecto") + "\n" +
    "Tiempo: " + tiempoSeg + " segundos";
}

function contador(arreglo) {
  const resultado = {
    negativos: 0,
    ceros: 0,
    positivos: 0
  };

  for (const n of arreglo) {
    if (n < 0) {
      resultado.negativos++;
    } else if (n === 0) {
      resultado.ceros++;
    } else {
      resultado.positivos++;
    }
  }

  return resultado;
}

function promedios(matriz) {
  return matriz.map(function(fila) {
    if (!Array.isArray(fila) || fila.length === 0) {
      return NaN;
    }

    const suma = fila.reduce(function(acc, val) {
      return acc + val;
    }, 0);

    return suma / fila.length;
  });
}

function inverso(numero) {
  const esNegativo = numero < 0;
  const invertido = Number(Math.abs(numero).toString().split("").reverse().join(""));
  return esNegativo ? -invertido : invertido;
}

class Libro {
  constructor(titulo, autor, anio) {
    this.titulo = titulo;
    this.autor = autor;
    this.anio = anio;
  }

  edad() {
    return new Date().getFullYear() - this.anio;
  }

  info() {
    return this.titulo + " - " + this.autor + " (" + this.anio + ")";
  }
}

function pruebas() {
  const anioActual = new Date().getFullYear();

  const r1 = contador([-3, -2, 0, 0, 4, 8, 1]);
  console.assert(r1.negativos === 2 && r1.ceros === 2 && r1.positivos === 3, "contador caso 1 falló");

  const r2 = contador([0, 0, 0]);
  console.assert(r2.negativos === 0 && r2.ceros === 3 && r2.positivos === 0, "contador caso 2 falló");

  const p1 = promedios([[10, 8, 6], [3, 3, 3], [5, 15]]);
  console.assert(p1[0] === 8 && p1[1] === 3 && p1[2] === 10, "promedios caso 1 falló");

  const p2 = promedios([[1], [], [2, 4]]);
  console.assert(p2[0] === 1 && Number.isNaN(p2[1]) && p2[2] === 3, "promedios caso 2 falló");

  console.assert(inverso(12345) === 54321, "inverso caso 1 falló");
  console.assert(inverso(1000) === 1, "inverso caso 2 falló");
  console.assert(inverso(-987) === -789, "inverso caso 3 falló");

  const libroPrueba = new Libro("Libro de prueba", "Autor prueba", 2000);
  console.assert(libroPrueba.edad() === anioActual - 2000, "Libro.edad() falló");
  console.assert(
    libroPrueba.info() === "Libro de prueba - Autor prueba (2000)",
    "Libro.info() falló"
  );
}

function mostrarResultadosFunciones() {
  const out = document.getElementById("outFunciones");
  const ejemploContador = contador([-5, -1, 0, 3, 7, 0]);
  const ejemploPromedios = promedios([[7, 8, 9], [10, 10], [4, 6, 8, 10]]);
  const ejemploInverso = inverso(12034);

  out.textContent =
    "contador([-5, -1, 0, 3, 7, 0]) => " + JSON.stringify(ejemploContador) + "\n" +
    "promedios([[7,8,9],[10,10],[4,6,8,10]]) => " + JSON.stringify(ejemploPromedios) + "\n" +
    "inverso(12034) => " + ejemploInverso + "\n\n" +
        "Pruebas ejecutadas. Revisa la consola para confirmar que no hubo fallos.";
}

function mostrarBiblioteca() {
  const out = document.getElementById("outLibros");
  const biblioteca = [
    new Libro("Cien años de soledad", "Gabriel García Márquez", 1967),
    new Libro("Don Quijote de la Mancha", "Miguel de Cervantes", 1605),
    new Libro("Clean Code", "Robert C. Martin", 2008),
    new Libro("El principito", "Antoine de Saint-Exupéry", 1943)
  ];

  const filas = biblioteca.map(function(libro) {
    return (
      "<tr>" +
      "<td>" + libro.titulo + "</td>" +
      "<td>" + libro.autor + "</td>" +
      "<td>" + libro.anio + "</td>" +
      "<td>" + libro.edad() + "</td>" +
      "<td>" + libro.info() + "</td>" +
      "</tr>"
    );
  }).join("");

  out.innerHTML =
    "<table>" +
    "<thead>" +
    "<tr><th>Título</th><th>Autor</th><th>Año</th><th>Antigüedad</th><th>Resumen</th></tr>" +
    "</thead>" +
    "<tbody>" + filas + "</tbody>" +
    "</table>";
}

pruebas();

document.getElementById("btnProblema1").addEventListener("click", problema1);
document.getElementById("btnProblema2").addEventListener("click", problema2);
document.getElementById("btnFunciones").addEventListener("click", mostrarResultadosFunciones);
document.getElementById("btnProblema6").addEventListener("click", mostrarBiblioteca);
