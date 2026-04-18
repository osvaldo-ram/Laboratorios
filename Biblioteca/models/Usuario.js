const bcrypt = require('bcryptjs');
const db = require('../util/database');

module.exports = class Usuario {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async save() {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        const [result] = await db.execute(
            'INSERT INTO usuarios (username, password) VALUES (?, ?)',
            [this.username, hashedPassword]
        );

        await Usuario.assignDefaultRole(result.insertId);

        return result;
    }

    static findById(id) {
        return db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    }

    static findByUsername(username) {
        return db.execute('SELECT * FROM usuarios WHERE username = ?', [username]);
    }

    static assignDefaultRole(usuarioId) {
        return db.execute(
            `INSERT IGNORE INTO usuarios_roles (usuario_id, rol_id)
             SELECT ?, id FROM roles WHERE nombre = 'usuario'`,
            [usuarioId]
        );
    }

    static async getAccess(usuarioId) {
        const [roles] = await db.execute(
            `SELECT roles.nombre
             FROM roles
             INNER JOIN usuarios_roles
                ON usuarios_roles.rol_id = roles.id
             WHERE usuarios_roles.usuario_id = ?
             ORDER BY roles.nombre`,
            [usuarioId]
        );

        const [permissions] = await db.execute(
            `SELECT DISTINCT permisos.clave
             FROM permisos
             INNER JOIN roles_permisos
                ON roles_permisos.permiso_id = permisos.id
             INNER JOIN usuarios_roles
                ON usuarios_roles.rol_id = roles_permisos.rol_id
             WHERE usuarios_roles.usuario_id = ?
             ORDER BY permisos.clave`,
            [usuarioId]
        );

        return {
            roles: roles.map(role => role.nombre),
            permissions: permissions.map(permission => permission.clave)
        };
    }
};
