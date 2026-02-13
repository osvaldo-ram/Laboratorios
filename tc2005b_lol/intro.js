// consola (log, info, warn, error, assert)
console.log("Hola mundo");
console.info("Creado en el 2009");
console.warn("Es adictivo");
console.error("Los tanques no deben de ir atras");

// operador de comparrion de tipo y valor
console.assert(1 === true);

// operador de comparrion de valores
console.assert(1== true);

//------------------- Variables, constantes ----------------------

// Forma antigua de declarar variables. Tienen mayor alcanzce por lo que no se recomienda su uso
var perrsonaje1 = "Gwen";

// Forma nueva de declarar variables. La variable solo vice dentro del ambito donde se declara
let personaje2 = "Mordekaiser";

const precioSkin = 300;

// alcance de las variabeles

{
    var personaje3 = "Aatrox";
    let personaje4 = "Morgana";

}

console.log(personaje3);
// console.log(personaje4); --- IGNORE  que no llega por su alcanze

//--------------------------- alert, prompt, confirm -------------------------
alert("No jueges este juego porfavor");
const personajeFavorito = prompt("¿Cual es tu personaje favorito?");
console.info("personaje favorito: " + personajeFavorito);

const hoyHayJuego = confirm("¿sale game?");
if(hoyHayJuego){
    console.warn("Vamos!");
}
else{
    console.infor(".....");
}


// --------------------------- Funciones -------------------------

function descargar () {
    window.location.herf = "https://www.leagueoflegends.com/es-mx/download/";
}

if (hoyHayJuego) {
    descargar();
}
else{
    console.info("Buen dia");
}

// funciones moderadas

() => {}

docuemto.getElementById("botonDesistalar").onclick = () => {}
    alert("jijiji");


const iniciarPartida = () => {
    alert
}

iniciarPartida();

// ------------------------------- Arreglos -----------------------------

const arreglo = ("Elementos");