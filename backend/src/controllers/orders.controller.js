const db = require('../config/db');

const normalizeState = (paypalStatus) => {
    const status = String(paypalStatus || '').toUpperCase();

    if (status === 'COMPLETED' || status === 'APPROVED') {
        return 'accepted';
    }

    if (status === 'VOIDED' || status === 'CANCELLED') {
        return 'cancelled';
    }

    if (status === 'DECLINED' || status === 'DENIED') {
        return 'rejected';
    }

    return 'error';
};

const getOrdersByUser = (req, res) => {
    const idUser = Number(req.params.id_user);

    if (!Number.isInteger(idUser) || idUser <= 0) {
        return res.status(400).json({ error: 'Usuario invalido' });
    }

    const sql = `
        SELECT
            o.id_order,
            o.id_user,
            o.payment_method,
            o.state,
            o.date,
            o.price,

            o.customer_name,
            o.street,
            o.city,
            o.state_address,
            o.postal_code,
            o.country,

            p.id AS product_id,
            p.name AS product_name,
            p.price AS product_price,
            p.image AS product_image,
            p.category AS product_category,
            COUNT(p.id) AS product_quantity
        FROM orders o
        LEFT JOIN products_orders po ON po.id_order = o.id_order
        LEFT JOIN products p ON p.id = po.id_product
        WHERE o.id_user = ?
        GROUP BY
            o.id_order,
            o.id_user,
            o.payment_method,
            o.state,
            o.date,
            o.price,

            o.customer_name,
            o.street,
            o.city,
            o.state_address,
            o.postal_code,
            o.country,

            p.id,
            p.name,
            p.price,
            p.image,
            p.category
        ORDER BY o.date DESC
    `;

    db.query(sql, [idUser], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener el historial de compras' });
        }

        const ordersMap = new Map();

        result.forEach((row) => {
            if (!ordersMap.has(row.id_order)) {
                ordersMap.set(row.id_order, {
                id_order: row.id_order,
                id_user: row.id_user,
                payment_method: row.payment_method,
                state: row.state,
                date: row.date,
                price: row.price,

                customer_name: row.customer_name,
                street: row.street,
                city: row.city,
                state_address: row.state_address,
                postal_code: row.postal_code,
                country: row.country,

                products: []
            });
            }

            if (row.product_id) {
                ordersMap.get(row.id_order).products.push({
                    id: row.product_id,
                    name: row.product_name,
                    price: row.product_price,
                    image: row.product_image,
                    category: row.product_category,
                    quantity: row.product_quantity
                });
            }
        });

        const orders = Array.from(ordersMap.values());

        res.json(orders);
    });
};

const createOrder = (req, res) => {
    const idUser = Number(req.body.id_user);
    const paymentMethod = req.body.payment_method || 'Digital wallet';
    const state = req.body.state || normalizeState(req.body.paypal_status);
    const price = Number(req.body.price);
    const products = Array.isArray(req.body.products) ? req.body.products : [];

    // DATOS DE ENVÍO
    const customerName = req.body.customer_name || '';
    const street = req.body.street || '';
    const city = req.body.city || '';
    const stateAddress = req.body.state_address || '';
    const postalCode = req.body.postal_code || '';
    const country = req.body.country || '';

    if (!Number.isInteger(idUser) || idUser <= 0) {
        return res.status(400).json({ error: 'Usuario invalido' });
    }

    if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({ error: 'Total invalido' });
    }

    if (!products.length) {
        return res.status(400).json({ error: 'La orden debe incluir productos' });
    }

    const validStates = ['accepted', 'rejected', 'cancelled', 'error'];
    if (!validStates.includes(state)) {
        return res.status(400).json({ error: 'Estado de orden invalido' });
    }

    db.beginTransaction((transactionError) => {
        if (transactionError) {
            return res.status(500).json({ error: 'Error al iniciar la orden' });
        }

        const orderSql = `
            INSERT INTO orders (
                id_user,
                payment_method,
                state,
                price,
                customer_name,
                street,
                city,
                state_address,
                postal_code,
                country
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
        db.query(
        orderSql,
            [
                idUser,
                paymentMethod,
                state,
                Math.round(price),

                customerName,
                street,
                city,
                stateAddress,
                postalCode,
                country
            ], (orderError, orderResult) => {
            if (orderError) {
                return db.rollback(() => res.status(500).json({ error: 'Error al guardar la orden' }));
            }

            const idOrder = orderResult.insertId;
            const rows = products.flatMap((product) => {
                const idProduct = Number(product.id_product ?? product.id);
                const quantity = Math.max(1, Number(product.quantity) || 1);

                if (!Number.isInteger(idProduct) || idProduct <= 0) {
                    return [];
                }

                return Array.from({ length: quantity }, () => [idOrder, idProduct]);
            });

            if (!rows.length) {
                return db.rollback(() => res.status(400).json({ error: 'Productos invalidos' }));
            }

            db.query('INSERT INTO products_orders (id_order, id_product) VALUES ?', [rows], (productsError) => {
                if (productsError) {
                    return db.rollback(() => res.status(500).json({ error: 'Error al guardar productos de la orden' }));
                }

                db.commit((commitError) => {
                    if (commitError) {
                        return db.rollback(() => res.status(500).json({ error: 'Error al confirmar la orden' }));
                    }

                    res.status(201).json({
                        id_order: idOrder,
                        id_user: idUser,
                        payment_method: paymentMethod,
                        state,
                        price: Math.round(price)
                    });
                });
            });
        });
    });
};

module.exports = {
    createOrder,
    getOrdersByUser
};
