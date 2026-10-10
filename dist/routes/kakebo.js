"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testController = __importStar(require("../controllers/test"));
const logsController = __importStar(require("../controllers/logs"));
const regaliController = __importStar(require("../controllers/regali"));
const speseController = __importStar(require("../controllers/spese"));
const tipologieController = __importStar(require("../controllers/tipologie"));
const viaggiController = __importStar(require("../controllers/viaggi"));
const notesController = __importStar(require("../controllers/notes"));
const router = express_1.default.Router();
router.get('/', testController.showFeedback);
router.get('/ping', testController.pong);
router.post('/log', logsController.newLog);
router.get('/log', logsController.fetchLogs);
router.post('/regalo', regaliController.newRegalo);
router.get('/regalo', regaliController.fetchRegali);
router.get('/regalo-chart', regaliController.fetchRegaliChart);
router.post('/spesa', speseController.newSpesa);
router.get('/spesa', speseController.fetchSpese);
router.get('/spesa-group', speseController.fetchSpeseGroup);
router.get('/spesa-chart', speseController.fetchSpeseChart);
router.delete('/spesa', speseController.deleteSpesa);
router.post('/tipo', tipologieController.newTipo);
router.get('/tipo', tipologieController.fetchTipi);
router.post('/viaggio', viaggiController.newViaggio);
router.get('/viaggio', viaggiController.fetchViaggi);
router.delete('/viaggio', viaggiController.deleteViaggio);
router.post('/viaggio-info', viaggiController.fetchSpeseViaggio);
router.get('/notes', notesController.fetchNotes);
router.post('/notes', notesController.newNote);
router.delete('/notes', notesController.deleteNote);
exports.default = router;
