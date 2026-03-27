const db = require('../config/db');

const getProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (error, result) => {
        if (error) {
            return res.status(500).json({
                error: 'Error al obtener el producto'
            });
        }
        res.json(result);
    });
};

module.exports = getProducts;