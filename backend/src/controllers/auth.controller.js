const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { name, last_name, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar en la BD (ajusta las columnas según tu base de datos)
        await db.query(
            'INSERT INTO users (name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [name, last_name, email, hashedPassword]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor al registrar usuario', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    console.log('--- Intento de Login ---', { email, password });

    try {
        // Buscar usuario en la BD
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: 'El usuario no existe' });
        }

        console.log('Password:', user.password);

        // Comparar contraseñas
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Valid:', validPassword);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        console.log('Generando JWT...');
        // Generar JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login exitoso, enviando respuesta al frontend.');
        // Responder con el token y datos públicos del usuario
        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('CRASH EN EL LOGIN:', error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
    }
};

module.exports = { signup, login };