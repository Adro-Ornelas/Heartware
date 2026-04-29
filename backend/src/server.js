require('dotenv').config();
require('ts-node/register');

const app = require('./app');
// const { connectDB } = require('./config/db');
const { validatePaypalConfig } = require('./config/paypal.config.ts');

const startServer = async () => {

    const PORT = process.env.PORT || 3000;
    try {
        // Validar que las credenciales de PayPal estén definidas antes de iniciar
        validatePaypalConfig();
        // await connectDB();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en http://localhost:${PORT}`,);    
// });