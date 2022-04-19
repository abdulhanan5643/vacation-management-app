require('dotenv').config();
const path = require('path');
const https = require('https');
const express = require('express');
const utilConfig = require('util992/config');
var cron = require('node-cron');
const requestRouter = require('./routes/requestRouter');
const employeeListRouter = require('./routes/employeeListRouter');
const processingRequest = require('./functions/processingRequest');
const { port, apiKey, baseId } = require('./common/commonVariables');

utilConfig.airtable.apiKey(apiKey);
utilConfig.airtable.baseId(baseId);

const app = express();
app.use(express.json());

cron.schedule('0 12-22 * * *', () => {
    processingRequest();
});

app.use('/api/request', requestRouter);

app.use('/api/employees', employeeListRouter);

app.get('/api', (req, res) => {
    const greetings = "Congratulations. You're successfully connected to airtable.";
    res.send(greetings);
})
app.use(express.static(path.resolve(__dirname, '../client/build')));
// All other GET requests not handled before will return our React app
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server listening at port ${port}...`)
})
