const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware para parsear datos del body
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware de logging
app.use((request, response, next) => {
    console.log(`[${new Date().toLocaleString()}] ${request.method} ${request.url}`);
    next();
});

// Crear directorio y archivo de datos si no existen
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'tareas.txt');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '[]', 'utf-8');
}

// Importar modulos de rutas
const tareasRoutes = require('./routes/tareas');
const accionesRoutes = require('./routes/acciones');

// Usar los modulos de rutas
app.use('/tareas', tareasRoutes);
app.use('/acciones', accionesRoutes);

// Ruta principal
app.get('/', (request, response) => {
    response.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Gestor de Tareas</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                    max-width: 600px;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                    font-size: 2.5em;
                }
                p {
                    color: #666;
                    margin-bottom: 30px;
                    font-size: 1.2em;
                }
                .menu {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                a {
                    display: block;
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    font-size: 1.1em;
                    transition: transform 0.3s;
                }
                a:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Gestor de Tareas</h1>
                <p>Organiza y administra tus tareas diarias</p>
                <div class="menu">
                    <a href="/tareas">Ver todas las tareas</a>
                    <a href="/acciones/nueva">Agregar nueva tarea</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Middleware para manejar rutas no encontradas (404)
app.use((request, response) => {
    response.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Pagina no encontrada</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                }
                .error-container {
                    text-align: center;
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                h1 {
                    font-size: 6em;
                    color: #fc5c7d;
                    margin: 0;
                }
                h2 {
                    color: #333;
                    margin: 20px 0;
                }
                p {
                    color: #666;
                    margin: 20px 0;
                }
                a {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    font-size: 1.1em;
                }
                a:hover {
                    opacity: 0.9;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>404</h1>
                <h2>Pagina no encontrada</h2>
                <p>La ruta <strong>${request.url}</strong> no existe en este servidor.</p>
                <a href="/">Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Usa npm run dev para reinicio automatico');
});
