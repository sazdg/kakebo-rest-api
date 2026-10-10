import express, { Router } from 'express'

import * as testController from '../controllers/test'
import * as logsController from '../controllers/logs'
import * as regaliController from '../controllers/regali'
import * as speseController from '../controllers/spese'
import * as tipologieController from '../controllers/tipologie'
import * as viaggiController from '../controllers/viaggi'
import * as notesController from '../controllers/notes'

const router: Router = express.Router()

router.get('/', testController.showFeedback)
router.get('/ping', testController.pong)

router.post('/log', logsController.newLog)
router.get('/log', logsController.fetchLogs)

router.post('/regalo', regaliController.newRegalo)
router.get('/regalo', regaliController.fetchRegali)
router.get('/regalo-chart', regaliController.fetchRegaliChart)

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
router.post('/viaggio-info', viaggiController.fetchSpeseViaggio)

router.get('/notes', notesController.fetchNotes)
router.post('/notes', notesController.newNote)
router.delete('/notes', notesController.deleteNote)

export default router 