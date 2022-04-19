const Airtable = require('airtable');
const Joi = require('joi');
const parseISO = require('date-fns/parseISO')
const differenceInBusinessDays = require('date-fns/differenceInBusinessDays');

const { apiKey, baseId, tableFields, sendError } = require('../common/commonVariables');
const { name, start_date, end_date, reason, comment, email, status, response, vacationsRequested, employee } = tableFields;
const base = new Airtable({ apiKey: apiKey }).base(baseId);

const requestFunction = async (requestFields) => {

  const details = Joi.object({
    [start_date]: Joi.string().required(),
    [end_date]: Joi.string().required(),
    [reason]: Joi.string().required(),
    [comment]: Joi.string().required(),
    [employee]: Joi.string().required(),
  })

  try {
    await details.validateAsync({
      [start_date]: requestFields.start_date,
      [end_date]: requestFields.end_date,
      [reason]: requestFields.reason,
      [comment]: requestFields.comment,
      [employee]: requestFields.employee,
    }, { abortEarly: false });
    base('Vacations').create([
      {
        "fields": {
          [status]: "In progress",
          [start_date]: requestFields.start_date,
          [end_date]: requestFields.end_date,
          [reason]: requestFields.reason,
          [comment]: requestFields.comment,
          [response]: "Waiting Decision",
          [employee]:[requestFields.employee],
          [vacationsRequested]: differenceInBusinessDays(parseISO(requestFields.end_date), parseISO(requestFields.start_date)) + 1
        }
      }
    ], function (err, records) {
      if (err) {
        console.error(err);
        return err;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    });
    return requestFields;
  }
  catch (err) {
    let error = [];
    err.details.map((err, i) => { return (error[i] = err.message) })
    return sendError(500, 'Internal Server Error', error, '/api/request');
  }
}

module.exports = requestFunction;