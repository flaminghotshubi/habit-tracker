const express = require('express');
const router = express.Router();
const controller = require('../controllers/home_controller');

router.get('/', controller.home);
router.get('/view', controller.home);
router.post('/create', controller.create);
router.get('/toggle/:id/:date', controller.toggle);

module.exports = router