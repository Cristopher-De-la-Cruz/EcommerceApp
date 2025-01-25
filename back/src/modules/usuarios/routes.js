const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Ruta para obtener todas las categorías

// Public
router.post('/register', (req, res) => {controller.register(req, res)});
router.post('/login', (req, res) => {controller.login(req, res)});

// Auth
router.get('/', (req, res) => {controller.get(req, res)});
router.put('/:id', (req, res) => {controller.update(req, res)});
router.put('/toggleState/:id', (req, res) => {controller.toggleState(req, res)});
module.exports = router;
