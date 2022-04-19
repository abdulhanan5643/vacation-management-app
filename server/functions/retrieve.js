const utilAirtable = require('util992/functions/airtable');

const { options,tableFields } = require('../common/commonVariables');

const retrieveFunction = async () => {
    const filteredRecords = await utilAirtable.get.records('Vacations', null, null, `AND(${tableFields.response} != '${options.response.waiting_decision}', ${tableFields.status} = '${options.status.in_progress}')`)
    const finalRecords = filteredRecords.body.map(record => {
        return record.fields
    })
    return finalRecords;
}

module.exports = retrieveFunction;