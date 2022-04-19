const express = require('express');
const employeeListFunction = require('../functions/employeesList');

const employeeListRouter = express.Router();

employeeListRouter.get('/', async (req, res) => {
    res.send(await employeeListFunction())
})

module.exports = employeeListRouter;