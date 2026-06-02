const db = require('../config/db');

const sanitizeUser = (user) => ({
    id_user: user.id_user,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    type: user.type
});

const getUserById = (req, res) => {
    const idUser = Number(req.params.id_user);

    if (!Number.isInteger(idUser) || idUser <= 0) {
        return res.status(400).json({ error: 'Usuario invalido' });
    }

    db.query('SELECT * FROM users WHERE id_user = ?', [idUser], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el usuario' });
        }

        if (!result.length) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(sanitizeUser(result[0]));
    });
};

const updateUser = (req, res) => {
    const idUser = Number(req.params.id_user);
    const { name, last_name: lastName, email, password, type } = req.body;

    if (!Number.isInteger(idUser) || idUser <= 0) {
        return res.status(400).json({ error: 'Usuario invalido' });
    }

    if (!name || !lastName || !email) {
        return res.status(400).json({ error: 'Nombre, apellidos y correo son obligatorios' });
    }

    const validTypes = ['admin', 'user'];
    const userType = validTypes.includes(type) ? type : 'user';
    const fields = ['name = ?', 'last_name = ?', 'email = ?', 'type = ?'];
    const values = [name, lastName, email, userType];

    if (password) {
        fields.push('password = ?');
        values.push(password);
    }

    values.push(idUser);

    db.query(`UPDATE users SET ${fields.join(', ')} WHERE id_user = ?`, values, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }

        if (!result.affectedRows) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        db.query('SELECT * FROM users WHERE id_user = ?', [idUser], (selectError, selectResult) => {
            if (selectError) {
                return res.status(500).json({ error: 'Error al obtener el usuario actualizado' });
            }

            res.json(sanitizeUser(selectResult[0]));
        });
    });
};

module.exports = {
    getUserById,
    updateUser
};
