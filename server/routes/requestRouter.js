const express = require('express');
const requestFunction = require('../functions/request');

const requestRouter = express.Router();

requestRouter.post('/', async (req, res) => {
    res.send(await requestFunction(req.body))
})

module.exports = requestRouter;