const db = require('../config/db');

// OBTENER TODOS LOS PRODUCTOS
const getProducts = async (req, res) => {
    const sql = 'SELECT * FROM products ORDER BY created_at DESC';    
    try {
        const [result] = await db.query(sql);        
        res.json(result);
    } catch (error) {
        console.error('Error al obtener productos de la BD:', error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// CREAR UN PRODUCTO
const createProduct = async (req, res) => {
    const { name, price, image, category, quantity, description, inventory_status } = req.body;
    
    const sql = `
        INSERT INTO products (name, price, image, category, quantity, description, inventory_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
        const [result] = await db.query(sql, [name, price, image, category, quantity, description, inventory_status]);
        
        // Recuperamos el producto recién creado para devolvérselo a Angular
        const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        
        res.status(201).json(newProduct[0]);
    } catch (error) {
        console.error('Error al crear producto:', error);
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// ACTUALIZAR UN PRODUCTO
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image, category, quantity, description, inventory_status } = req.body;
    
    const sql = `
        UPDATE products 
        SET name = ?, price = ?, image = ?, category = ?, quantity = ?, description = ?, inventory_status = ? 
        WHERE id = ?
    `;
    
    try {
        const [result] = await db.query(sql, [name, price, image, category, quantity, description, inventory_status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        // Devolvemos el producto actualizado para que Angular refresque su interfaz
        const [updatedProduct] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        res.json(updatedProduct[0]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// ELIMINAR UN PRODUCTO
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    
    try {
        const [result] = await db.query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado correctamente', id: Number(id) });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

// Exportamos todos los métodos
module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};