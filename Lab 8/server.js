// Importa los modulos nativos de Node.js
const http = require('http');
const fs = require('fs');

// Define el puerto del servidor
const puerto = 3000;

// Crea el servidor HTTP
const servidor = http.createServer((req, res) => {
  // Verifica si la peticion es a la ruta principal
  if (req.url === '/') {
    // Lee el archivo HTML que se debe mostrar
    fs.readFile('pagina.html', 'utf8', (error, data) => {
      // Si ocurre un error al leer el archivo responde con error 500
      if (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error al leer el archivo pagina.html');
        return;
      }

      // Si no hay error responde con el contenido HTML
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else {
    // Si la ruta no existe devuelve 404
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Ruta no encontrada');
  }
});

// Inicia el servidor en el puerto indicado
servidor.listen(puerto, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
