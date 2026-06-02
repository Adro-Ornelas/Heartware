const express = require('express');
// Importamos todas las funciones del controlador
const { getUserById, updateUser, getAllUsers, createUser, deleteUser } = require('../controllers/users.controller');

const router = express.Router();

// Rutas mapeadas
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id_user', getUserById);
router.put('/users/:id_user', updateUser);
router.delete('/users/:id_user', deleteUser);

module.exports = router;