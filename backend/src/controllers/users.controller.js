const db = require('../config/db');
const bcrypt = require('bcrypt');
const sanitizeUser = (user) => ({
    id_user: user.id_user,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    type: user.type
});

const getUserById = async (req, res) => {
    try {
        const idUser = Number(req.params.id_user);

        if (!Number.isInteger(idUser) || idUser <= 0) {
            return res.status(400).json({ error: 'Usuario invalido' });
        }

        const [result] = await db.query(
            'SELECT * FROM users WHERE id_user = ?',
            [idUser]
        );

        if (!result.length) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        res.json(sanitizeUser(result[0]));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al obtener el usuario'
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const idUser = Number(req.params.id_user);

        const {
            name,
            last_name: lastName,
            email,
            password,
            type
        } = req.body;

        if (!Number.isInteger(idUser) || idUser <= 0) {
            return res.status(400).json({
                error: 'Usuario invalido'
            });
        }

        if (!name || !lastName || !email) {
            return res.status(400).json({
                error: 'Nombre, apellidos y correo son obligatorios'
            });
        }

        const validTypes = ['admin', 'user'];

        const userType = validTypes.includes(type)
            ? type
            : 'user';

        const fields = [
            'name = ?',
            'last_name = ?',
            'email = ?',
            'type = ?'
        ];

        const values = [
            name,
            lastName,
            email,
            userType
        ];

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);

            fields.push('password = ?');
            values.push(hashedPassword);
        }

        values.push(idUser);

        const [result] = await db.query(
            `UPDATE users
             SET ${fields.join(', ')}
             WHERE id_user = ?`,
            values
        );

        if (!result.affectedRows) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        const [updatedUser] = await db.query(
            'SELECT * FROM users WHERE id_user = ?',
            [idUser]
        );

        res.json(sanitizeUser(updatedUser[0]));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al actualizar el usuario'
        });
    }
};

module.exports = {
    getUserById,
    updateUser
};