const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta al archivo de datos
const dataFile = path.join(__dirname, '..', 'data', 'tareas.txt');

// Funcion auxiliar para leer tareas
function leerTareas() {
    try {
        const contenido = fs.readFileSync(dataFile, 'utf-8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error('Error leyendo tareas:', error);
        return [];
    }
}

// GET /tareas - Lista de todas las tareas
router.get('/', (request, response) => {
    console.log('Mostrando lista de tareas');
    const tareas = leerTareas();

    let tareasHTML = '';

    if (tareas.length === 0) {
        tareasHTML = '<div class="no-tareas">No hay tareas pendientes. Agrega una nueva.</div>';
    } else {
        tareasHTML = tareas.map((tarea, index) => {
            const estadoClase = tarea.completada ? 'completada' : 'pendiente';
            const estadoTexto = tarea.completada ? 'Completada' : 'Pendiente';

            return `
                <div class="tarea ${estadoClase}">
                    <div class="tarea-header">
                        <h3>${tarea.titulo}</h3>
                        <span class="estado ${estadoClase}">${estadoTexto}</span>
                    </div>
                    <p class="descripcion">${tarea.descripcion || 'Sin descripcion'}</p>
                    <div class="fecha">Fecha: ${tarea.fecha}</div>
                    <div class="acciones">
                        <a href="/tareas/${index}" class="btn btn-ver">Ver detalle</a>
                        ${!tarea.completada
                            ? `<a href="/acciones/completar/${index}" class="btn btn-completar">Completar</a>`
                            : `<span class="completado-label">Completada</span>`
                        }
                        <a href="/acciones/eliminar/${index}" class="btn btn-eliminar">Eliminar</a>
                    </div>
                </div>
            `;
        }).join('');
    }

    response.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Tareas</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f0f2f5;
                    min-height: 100vh;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    margin-bottom: 30px;
                    max-width: 900px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .tarea {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    transition: transform 0.3s;
                }
                .tarea:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                }
                .tarea.completada {
                    opacity: 0.7;
                    background: #f8f9fa;
                }
                .tarea-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    margin-bottom: 10px;
                }
                .estado {
                    padding: 6px 12px;
                    border-radius: 999px;
                    font-size: 0.85em;
                    font-weight: bold;
                }
                .estado.completada {
                    background: #d4edda;
                    color: #155724;
                }
                .estado.pendiente {
                    background: #fff3cd;
                    color: #856404;
                }
                .tarea h3 {
                    color: #333;
                    font-size: 1.3em;
                }
                .tarea.completada h3 {
                    text-decoration: line-through;
                    color: #888;
                }
                .descripcion {
                    color: #666;
                    margin: 10px 0;
                }
                .fecha {
                    color: #999;
                    font-size: 0.9em;
                    margin: 10px 0;
                }
                .acciones {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                    flex-wrap: wrap;
                }
                .btn {
                    padding: 8px 15px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 0.9em;
                    transition: all 0.3s;
                }
                .btn-ver {
                    background: #3498db;
                    color: white;
                }
                .btn-ver:hover {
                    background: #2980b9;
                }
                .btn-completar {
                    background: #2ecc71;
                    color: white;
                }
                .btn-completar:hover {
                    background: #27ae60;
                }
                .btn-eliminar {
                    background: #e74c3c;
                    color: white;
                }
                .btn-eliminar:hover {
                    background: #c0392b;
                }
                .completado-label {
                    padding: 8px 15px;
                    background: #95a5a6;
                    color: white;
                    border-radius: 8px;
                    font-size: 0.9em;
                }
                .no-tareas {
                    text-align: center;
                    padding: 60px;
                    background: white;
                    border-radius: 15px;
                    color: #999;
                    font-size: 1.2em;
                }
                .nav-buttons {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .nav-btn {
                    display: inline-block;
                    padding: 12px 25px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    margin: 0 10px;
                    transition: transform 0.3s;
                }
                .nav-btn:hover {
                    transform: translateY(-3px);
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Lista de Tareas</h1>
            </div>
            <div class="container">
                <div class="nav-buttons">
                    <a href="/" class="nav-btn">Inicio</a>
                    <a href="/acciones/nueva" class="nav-btn">Nueva Tarea</a>
                </div>
                ${tareasHTML}
            </div>
        </body>
        </html>
    `);
});

// GET /tareas/:id - Detalle de una tarea especifica
router.get('/:id', (request, response) => {
    const tareas = leerTareas();
    const id = parseInt(request.params.id, 10);

    console.log(`Mostrando detalle de tarea ${id}`);

    if (isNaN(id) || id < 0 || id >= tareas.length) {
        return response.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Tarea no encontrada</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background: #f0f2f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .error {
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    }
                    h1 { color: #e74c3c; }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #3498db;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>Tarea no encontrada</h1>
                    <p>La tarea con ID ${id} no existe.</p>
                    <a href="/tareas">Volver a la lista</a>
                </div>
            </body>
            </html>
        `);
    }

    const tarea = tareas[id];
    const estadoTexto = tarea.completada ? 'Completada' : 'Pendiente';

    response.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detalle de Tarea</title>
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
                    padding: 20px;
                }
                .detalle-container {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    max-width: 600px;
                    width: 100%;
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                }
                .info-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                .info-label {
                    font-weight: bold;
                    color: #666;
                    margin-bottom: 5px;
                }
                .info-value {
                    color: #333;
                    font-size: 1.1em;
                }
                .estado {
                    display: inline-block;
                    padding: 8px 15px;
                    border-radius: 8px;
                    font-weight: bold;
                }
                .estado.completada {
                    background: #d4edda;
                    color: #155724;
                }
                .estado.pendiente {
                    background: #fff3cd;
                    color: #856404;
                }
                .acciones {
                    display: flex;
                    gap: 10px;
                    margin-top: 30px;
                    flex-wrap: wrap;
                }
                .btn {
                    flex: 1;
                    padding: 12px 20px;
                    text-decoration: none;
                    text-align: center;
                    border-radius: 10px;
                    transition: all 0.3s;
                    min-width: 120px;
                }
                .btn-volver {
                    background: #95a5a6;
                    color: white;
                }
                .btn-volver:hover {
                    background: #7f8c8d;
                }
                .btn-completar {
                    background: #2ecc71;
                    color: white;
                }
                .btn-completar:hover {
                    background: #27ae60;
                }
                .btn-eliminar {
                    background: #e74c3c;
                    color: white;
                }
                .btn-eliminar:hover {
                    background: #c0392b;
                }
            </style>
        </head>
        <body>
            <div class="detalle-container">
                <h1>Detalle de Tarea #${id + 1}</h1>

                <div class="info-item">
                    <div class="info-label">Titulo:</div>
                    <div class="info-value">${tarea.titulo}</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Descripcion:</div>
                    <div class="info-value">${tarea.descripcion || 'Sin descripcion'}</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Fecha de creacion:</div>
                    <div class="info-value">${tarea.fecha}</div>
                </div>

                <div class="info-item">
                    <div class="info-label">Estado:</div>
                    <div class="info-value">
                        <span class="estado ${tarea.completada ? 'completada' : 'pendiente'}">
                            ${estadoTexto}
                        </span>
                    </div>
                </div>

                <div class="acciones">
                    <a href="/tareas" class="btn btn-volver">Volver a la lista</a>
                    ${!tarea.completada
                        ? `<a href="/acciones/completar/${id}" class="btn btn-completar">Completar</a>`
                        : ''
                    }
                    <a href="/acciones/eliminar/${id}" class="btn btn-eliminar">Eliminar</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

module.exports = router;
