const express = require('express');
const { getUserById, updateUser } = require('../controllers/users.controller');

const router = express.Router();

router.get('/users/:id_user', getUserById);
router.put('/users/:id_user', updateUser);

module.exports = router;
