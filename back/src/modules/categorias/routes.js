const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.get('/', (req, res) => {controller.get(req, res)});
router.post('/', (req, res) => {controller.store(req, res)});
router.put('/:id', (req, res) => {controller.update(req, res)});
router.put('/toggleState/:id', (req, res) => {controller.toggleState(req, res)});

module.exports = router;
