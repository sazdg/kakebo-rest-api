const express = require('express')
const router = express.Router()

const testController = require('../controllers/test')
const logsController = require('../controllers/logs')
const regaliController = require('../controllers/regali')
const speseController = require('../controllers/spese')
const tipologieController = require('../controllers/tipologie')
const viaggiController = require('../controllers/viaggi')
const notesController = require('../controllers/notes')

router.get('/', testController.showFeedback)
router.get('/ping', testController.pong)

router.post('/log', logsController.newLog)
router.get('/log', logsController.fetchLogs)

router.post('/regalo', regaliController.newRegalo)
router.get('/regalo', regaliController.fetchRegali)

router.post('/spesa', speseController.newSpesa)
router.get('/spesa', speseController.fetchSpese)
router.get('/spesa-group', speseController.fetchSpeseGroup)
router.get('/spesa-chart', speseController.fetchSpeseChart)
router.delete('/spesa', speseController.deleteSpesa)

router.post('/tipo', tipologieController.newTipo)
router.get('/tipo', tipologieController.fetchTipi)

router.post('/viaggio', viaggiController.newViaggio)
router.get('/viaggio', viaggiController.fetchViaggi)
router.delete('/viaggio', viaggiController.deleteViaggio)

router.get('/notes', notesController.fetchNotes)
router.post('/notes', notesController.newNote)
router.delete('/notes', notesController.deleteNote)

module.exports = router