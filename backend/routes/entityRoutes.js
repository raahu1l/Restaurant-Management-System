const express = require('express');
const controller = require('../controllers/entityController');
const router = express.Router();
router.get('/:entity', controller.list);
router.post('/:entity', controller.create);
router.put('/:entity/:id', controller.update);
router.delete('/:entity/:id', controller.remove);
module.exports = router;
