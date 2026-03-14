const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta al archivo de datos
const dataFile = path.join(__dirname, '..', 'data', 'tareas.txt');

// Funciones auxiliares
function leerTareas() {
    try {
        const contenido = fs.readFileSync(dataFile, 'utf-8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error('Error leyendo tareas:', error);
        return [];
    }
}

function guardarTareas(tareas) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(tareas, null, 2), 'utf-8');
        console.log('Tareas guardadas en tareas.txt');
        return true;
    } catch (error) {
        console.error('Error guardando tareas:', error);
        return false;
    }
}

// GET /acciones/nueva - Formulario para crear nueva tarea
router.get('/nueva', (request, response) => {
    console.log('Mostrando formulario de nueva tarea');

    response.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nueva Tarea</title>
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
                .form-container {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    max-width: 500px;
                    width: 100%;
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                    text-align: center;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    color: #555;
                    font-weight: bold;
                }
                input[type="text"],
                textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1em;
                    transition: border-color 0.3s;
                }
                input[type="text"]:focus,
                textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }
                textarea {
                    resize: vertical;
                    min-height: 100px;
                }
                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 30px;
                }
                button {
                    flex: 1;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1em;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .btn-submit {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
                }
                .btn-cancel {
                    background: #e0e0e0;
                    color: #666;
                }
                .btn-cancel:hover {
                    background: #d0d0d0;
                }
                .required {
                    color: #e74c3c;
                }
            </style>
        </head>
        <body>
            <div class="form-container">
                <h1>Nueva Tarea</h1>
                <form action="/acciones/nueva" method="POST">
                    <div class="form-group">
                        <label for="titulo">
                            Titulo <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            required
                            placeholder="Ej: Completar el laboratorio de Express"
                        >
                    </div>

                    <div class="form-group">
                        <label for="descripcion">
                            Descripcion (opcional)
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            placeholder="Agrega detalles sobre la tarea..."
                        ></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-submit">
                            Guardar tarea
                        </button>
                        <button type="button" class="btn-cancel" onclick="window.location.href='/tareas'">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </body>
        </html>
    `);
});

// POST /acciones/nueva - Procesar el formulario y guardar la tarea
router.post('/nueva', (request, response) => {
    console.log('Procesando nueva tarea:', request.body);

    const { titulo, descripcion } = request.body;

    if (!titulo || titulo.trim() === '') {
        return response.status(400).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Error</title>
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
                    <h1>Error</h1>
                    <p>El titulo de la tarea es obligatorio.</p>
                    <a href="/acciones/nueva">Volver al formulario</a>
                </div>
            </body>
            </html>
        `);
    }

    const tareas = leerTareas();

    const nuevaTarea = {
        titulo: titulo.trim(),
        descripcion: descripcion ? descripcion.trim() : '',
        fecha: new Date().toLocaleString('es-ES'),
        completada: false
    };

    tareas.push(nuevaTarea);

    if (guardarTareas(tareas)) {
        console.log('Tarea guardada exitosamente en tareas.txt');
        response.redirect('/tareas');
    } else {
        response.status(500).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Error</title>
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
                    <h1>Error del servidor</h1>
                    <p>No se pudo guardar la tarea. Intenta nuevamente.</p>
                    <a href="/acciones/nueva">Volver al formulario</a>
                </div>
            </body>
            </html>
        `);
    }
});

// GET /acciones/completar/:id - Marcar tarea como completada
router.get('/completar/:id', (request, response) => {
    const id = parseInt(request.params.id, 10);
    const tareas = leerTareas();

    console.log(`Completando tarea ${id}`);

    if (isNaN(id) || id < 0 || id >= tareas.length) {
        return response.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Error</title>
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
                    <p>La tarea que intentas completar no existe.</p>
                    <a href="/tareas">Volver a la lista</a>
                </div>
            </body>
            </html>
        `);
    }

    tareas[id].completada = true;

    if (guardarTareas(tareas)) {
        console.log(`Tarea ${id} marcada como completada`);
        response.redirect('/tareas');
    } else {
        response.status(500).send('Error al completar la tarea');
    }
});

// GET /acciones/eliminar/:id - Eliminar una tarea
router.get('/eliminar/:id', (request, response) => {
    const id = parseInt(request.params.id, 10);
    const tareas = leerTareas();

    console.log(`Eliminando tarea ${id}`);

    if (isNaN(id) || id < 0 || id >= tareas.length) {
        return response.status(404).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Error</title>
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
                    <p>La tarea que intentas eliminar no existe.</p>
                    <a href="/tareas">Volver a la lista</a>
                </div>
            </body>
            </html>
        `);
    }

    tareas.splice(id, 1);

    if (guardarTareas(tareas)) {
        console.log(`Tarea ${id} eliminada`);
        response.redirect('/tareas');
    } else {
        response.status(500).send('Error al eliminar la tarea');
    }
});

module.exports = router;
