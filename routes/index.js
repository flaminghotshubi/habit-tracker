const express = require('express');
const router = express.Router();
const controller = require('../controllers/home_controller');

//default view
router.get('/', controller.home);

//week view
router.get('/view', controller.home);

//create new
router.post('/create', controller.create);

//toggle actions on week view
router.get('/toggle/:id/:date', controller.toggle);

module.exports = router