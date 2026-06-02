const db = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const sanitizeUser = (user) => ({
    id_user: user.id_user,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    type: user.type
});

const getAllUsers = async (req, res) => {
    try {
        // Hacemos el SELECT excluyendo explícitamente el campo password
        const [rows] = await db.query(
            'SELECT id_user, name, last_name, email, type FROM users'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error en getAllUsers:', error);
        res.status(500).json({ message: 'Error interno al obtener los usuarios' });
    }
};

/**
 * POST /api/users
 * Crea un nuevo usuario en la base de datos
 */
const createUser = async (req, res) => {
    const { name, last_name, email, password, type } = req.body;

    // Validación básica de campos requeridos
    if (!name || !last_name || !email || !password || !type) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // 1. Verificar si el correo ya existe para evitar duplicados
        const [existing] = await db.query('SELECT id_user FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // 2. Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 3. Insertar en la base de datos
        const [result] = await db.query(
            'INSERT INTO users (name, last_name, email, password, type) VALUES (?, ?, ?, ?, ?)',
            [name, last_name, email, hashedPassword, type]
        );

        // 4. Retornar el usuario creado (con el ID autogenerado) al frontend de Angular
        res.status(201).json({
            id_user: result.insertId,
            name,
            last_name,
            email,
            type
        });
    } catch (error) {
        console.error('Error en createUser:', error);
        res.status(500).json({ message: 'Error interno al crear el usuario' });
    }
};

/**
 * PUT /api/users/:id_user
 * Modifica un usuario existente
 */
const updateUser = async (req, res) => {
    const { id_user } = req.params;
    const { name, last_name, email, password, type } = req.body;

    try {
        // 1. Verificar si el usuario existe
        const [userCheck] = await db.query('SELECT * FROM users WHERE id_user = ?', [id_user]);
        if (userCheck.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        let query = 'UPDATE users SET name = ?, last_name = ?, email = ?, type = ?';
        let queryParams = [name, last_name, email, type];

        // 2. Si el frontend envió una nueva contraseña, la encriptamos y la añadimos al Query
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            query += ', password = ?';
            queryParams.push(hashedPassword);
        }

        // Cerramos el query con el WHERE
        query += ' WHERE id_user = ?';
        queryParams.push(id_user);

        // 3. Ejecutar la actualización
        await db.query(query, queryParams);

        // 4. Responder con los datos actualizados para que Angular refresque el Signal
        res.json({
            id_user: Number(id_user),
            name,
            last_name,
            email,
            type
        });
    } catch (error) {
        console.error('Error en updateUser:', error);
        res.status(500).json({ message: 'Error interno al actualizar el usuario' });
    }
};

/**
 * DELETE /api/users/:id_user
 * Elimina de forma permanente un usuario
 */
const deleteUser = async (req, res) => {
    const { id_user } = req.params;

    try {
        const [result] = await db.query('DELETE FROM users WHERE id_user = ?', [id_user]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o ya eliminado.' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({ message: 'Error interno al eliminar el usuario' });
    }
};

/**
 * GET /api/users/:id_user
 * Mantiene tu método de consulta individual intacto
 */
const getUserById = async (req, res) => {
    const { id_user } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT id_user, name, last_name, email, type FROM users WHERE id_user = ?', 
            [id_user]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error en getUserById:', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById
};