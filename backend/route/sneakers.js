const express = require('express');
const router = express.Router();
const controller = require('../controllers/sneaker'); // localistion du fichier de configuration des actions des routed


//Definit des routes
router.get('/cpus', controller.getcpus) // défition des routes disponibles les actions éxécutées par les routes sont définies dans sneakers.js


router.get('/cpu', controller.getcpus)



module.exports = router;