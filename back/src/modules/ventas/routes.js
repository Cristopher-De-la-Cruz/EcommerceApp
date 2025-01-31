const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.get('/', (req, res) => {controller.get(req, res)});
router.post('/', (req, res) => {controller.store(req, res)});

module.exports = router;
