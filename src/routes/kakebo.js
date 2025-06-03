const express = require('express')
const router = express.Router()

const testController = require('../controllers/test')
const logsController = require('../controllers/logs')
const regaliController = require('../controllers/regali')
const speseController = require('../controllers/spese')
const tipologieController = require('../controllers/tipologie')
const viaggiController = require('../controllers/viaggi')

router.get('/', testController.showFeedback)
router.get('/ping', testController.pong)

router.post('/log', logsController.newLog)
router.get('/log', logsController.fetchLogs)

router.post('/regalo', regaliController.newRegalo)
router.get('/regalo', regaliController.fetchRegali)

router.post('/spesa', speseController.newSpesa)
router.get('/spesa', speseController.fetchSpese)
router.get('/spesa-group', speseController.fetchSpeseGroup)
router.delete('/spesa', speseController.deleteSpesa)

router.post('/tipo', tipologieController.newTipo)
router.get('/tipo', tipologieController.fetchTipi)

router.post('/viaggio', viaggiController.newViaggio)
router.get('/viaggio', viaggiController.fetchViaggi)

module.exports = router