//configuracion de rutas del CRUD de citas
const express = require('express');
const citasController = require('../controllers/controllerCitas');
const router = express.Router();

router.get('/citas', citasController.getCitas);

router.get('/citas/:id', citasController.getCitaById);

router.post('/citas', citasController.createCita);

router.put('/citas/:id', citasController.updateCita);

router.delete('/citas/:id', citasController.deleteCita);

module.exports = router;