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

const getOrdersByUser = async (req, res) => {
    try {
        const idUser = Number(req.params.id_user);

        if (!Number.isInteger(idUser) || idUser <= 0) {
            return res.status(400).json({
                error: 'Usuario invalido'
            });
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

            LEFT JOIN products_orders po
                ON po.id_order = o.id_order

            LEFT JOIN products p
                ON p.id = po.id_product

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

        const [result] = await db.query(sql, [idUser]);

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

        orders.forEach((order, index) => {
            order.user_order_number = orders.length - index;
        });

        res.json(orders);

        res.json(orders);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al obtener historial'
        });
    }
};

const createOrder = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const idUser = Number(req.body.id_user);
        const paymentMethod = req.body.payment_method || 'Digital wallet';
        const state = req.body.state || normalizeState(req.body.paypal_status);
        const price = Number(req.body.price);

        const products = Array.isArray(req.body.products)
            ? req.body.products
            : [];

        if (!products.length) {
            return res.status(400).json({
                error: 'La orden debe incluir productos'
            });
        }

        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            `
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
            `,
            [
                idUser,
                paymentMethod,
                state,
                Math.round(price),

                req.body.customer_name || '',
                req.body.street || '',
                req.body.city || '',
                req.body.state_address || '',
                req.body.postal_code || '',
                req.body.country || ''
            ]
        );

        const idOrder = orderResult.insertId;

        const rows = [];

        products.forEach((product) => {
            const idProduct = Number(product.id_product);

            const quantity = Math.max(
                1,
                Number(product.quantity) || 1
            );

            for (let i = 0; i < quantity; i++) {
                rows.push([idOrder, idProduct]);
            }
        });


        await connection.query(
            'INSERT INTO products_orders (id_order, id_product) VALUES ?',
            [rows]
        );
        for (const product of products) {
            // Asegúrate de usar la propiedad correcta según lo que mande tu frontend (id_product o id)
            const idProduct = Number(product.id_product || product.id);
            const quantityPurchased = Math.max(1, Number(product.quantity) || 1);

            const [updateResult] = await connection.query(
                `UPDATE products 
         SET quantity = quantity - ?,
             inventoryStatus = CASE 
                 WHEN (quantity - ?) <= 0 THEN 'OUTOFSTOCK'
                 WHEN (quantity - ?) <= 5 THEN 'LOWSTOCK' 
                 ELSE 'INSTOCK'
             END
         WHERE id = ? AND quantity >= ?`,
                [quantityPurchased, quantityPurchased, quantityPurchased, idProduct, quantityPurchased]
            );

            // Validación de seguridad: si affectedRows es 0, significa que no había suficiente stock en BD
            if (updateResult.affectedRows === 0) {
                throw new Error(`Stock insuficiente para el producto ID: ${idProduct}`);
            }
        }

        await connection.commit();

        res.status(201).json({
            id_order: idOrder,
            id_user: idUser,
            payment_method: paymentMethod,
            state,
            price
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            error: 'Error al guardar la orden'
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
    getOrdersByUser
};
