const http = require('http');
const fs = require('fs');
const path = require('path');

// Define el puerto del servidor
const PORT = 3000;

// Rutas absolutas a carpetas y archivos del laboratorio
const viewsPath = path.join(__dirname, 'views');
const dataPath = path.join(__dirname, 'data', 'mensajes.txt');

// Funcion auxiliar para enviar archivos HTML
function sendHtmlFile(res, fileName, statusCode = 200) {
  const filePath = path.join(viewsPath, fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Error 500</h1><p>No se pudo cargar la página.</p>');
      return;
    }

    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}

// Crea el servidor HTTP con ruteo manual usando req.method y req.url
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Ruta GET /
  // Devuelve index.html con enlaces a otras paginas
  if (method === 'GET' && url === '/') {
    sendHtmlFile(res, 'index.html');
    return;
  }

  // Ruta GET /form
  // Devuelve la forma HTML para capturar nombre y mensaje
  if (method === 'GET' && url === '/form') {
    sendHtmlFile(res, 'form.html');
    return;
  }

  // Ruta POST /submit
  // Recibe datos del formulario, los procesa y guarda en mensajes.txt
  if (method === 'POST' && url === '/submit') {
    let body = '';

    // Se ejecuta cada vez que llega un bloque de datos del body
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    // Se ejecuta cuando termina de llegar todo el body
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const nombre = params.get('nombre') || 'Anónimo';
      const mensaje = params.get('mensaje') || '';

      // Linea a guardar en el archivo de texto
      const registro = `${new Date().toISOString()} | ${nombre} | ${mensaje}\n`;

      fs.appendFile(dataPath, registro, 'utf8', (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>Error 500</h1><p>No se pudo guardar el mensaje.</p>');
          return;
        }

        // Respuesta de confirmacion en HTML
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <html>
            <head><title>Confirmación</title></head>
            <body>
              <h1>Mensaje guardado correctamente</h1>
              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>Mensaje:</strong> ${mensaje}</p>
              <a href="/">Volver al inicio</a> |
              <a href="/mensajes">Ver mensajes</a>
            </body>
          </html>
        `);
      });
    });

    return;
  }

  // Ruta GET /mensajes
  // Lee mensajes.txt y muestra su contenido en formato HTML
  if (method === 'GET' && url === '/mensajes') {
    fs.readFile(dataPath, 'utf8', (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <html>
              <head><title>Mensajes</title></head>
              <body>
                <h1>Mensajes guardados</h1>
                <p>Aún no hay mensajes.</p>
                <a href="/">Volver al inicio</a>
              </body>
            </html>
          `);
          return;
        }

        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Error 500</h1><p>No se pudo leer el archivo de mensajes.</p>');
        return;
      }

      const lineas = content
        .split('\n')
        .filter((linea) => linea.trim() !== '')
        .map((linea) => `<li>${linea}</li>`)
        .join('');

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html>
          <head><title>Mensajes</title></head>
          <body>
            <h1>Mensajes guardados</h1>
            ${lineas ? `<ul>${lineas}</ul>` : '<p>Aún no hay mensajes.</p>'}
            <a href="/">Volver al inicio</a>
          </body>
        </html>
      `);
    });

    return;
  }

  // Cualquier otra ruta devuelve 404.html
  sendHtmlFile(res, '404.html', 404);
});

// Inicia el servidor y muestra mensaje en consola
server.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
