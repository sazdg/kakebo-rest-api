"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pong = exports.showFeedback = void 0;
const showFeedback = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json({ result: 'welcome' });
};
exports.showFeedback = showFeedback;
const pong = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json({ result: 'pong' });
};
exports.pong = pong;
