const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { fileMiddleware } = require('../../helper/handleFile');


router.get('/', (req, res) => { controller.get(req, res) });
router.post('/', fileMiddleware([{name:'imagen'}]), (req, res) => { controller.store(req, res) });
router.put('/:id', (req, res) => { controller.update(req, res) });
router.put('/toggleState/:id', (req, res) => { controller.toggleState(req, res) });
router.put('/inactiveImage/:id', (req, res) => { controller.inactiveImage(req, res) });
router.put('/reactiveImage/:id', (req, res) => { controller.reactiveImage(req, res) });
router.delete('/deleteImage/:id', (req, res) => { controller.deleteImage(req, res) });
router.post('/addImages', fileMiddleware([{name: 'imagenes'}]), (req, res) => { controller.addImages(req, res) });

module.exports = router;
