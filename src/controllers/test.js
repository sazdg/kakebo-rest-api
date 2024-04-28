
const showFeedback = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.status(200).json({ result: 'welcome' })
}


const pong = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.status(200).json({ result: 'pong' })
}

module.exports = { showFeedback, pong }