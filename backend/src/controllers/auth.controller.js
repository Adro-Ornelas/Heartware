import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {
    console.log("Signup");
    // Verify if user exits BD
    // TDP

    // Encrypt password
    const hashedPasword = await bcrypt.hash(passwrod, 10);

    // insert user in BD
    // TDP
}

export const login = async (req, res) => {

    // Verify if user exits BD

    // Search user in BD    

    // Get hash

    // TDP

    // Compare hashes
    const validPassword = await bcrypt.compare(passwrod, user.passwrod);

    // Encrypt password
    const hashedPasword = await bcrypt.hash(passwrod, 10);

    if (!validPassword) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }


    // Generate JWT
    const token = jwt.sign({
        id: user.id,
        email: user.email,

    },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Response
}
