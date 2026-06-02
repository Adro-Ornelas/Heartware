const db = require('../config/db');

const getProducts = async (req, res) => {
    const sql = 'SELECT * FROM products';    
    try {
        const [result] = await db.query(sql);        
        res.json(result);
    } catch (error) {
        console.error('Error al obtener productos de la BD:', error);
        return res.status(500).json({
            error: 'Error al obtener el producto'
        });
    }
};

module.exports = getProducts;