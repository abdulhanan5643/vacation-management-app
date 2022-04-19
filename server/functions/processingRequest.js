const retrieveFunction = require("./retrieve");
const sendEmailFunction = require("./sendEmail");
const { tableFields, options } = require("../common/commonVariables");
const utilAirtable = require("util992/functions/airtable");

const processingRequest = async () => {
  const { body } = await utilAirtable.get.records("Employees", null);
  const requests = await retrieveFunction();
  const approved = requests.filter((request) => {
    return request.Response == "Approved";
  });
  const rejected = requests.filter((request) => {
    return request.Response == "Rejected";
  });
  let defaultEmployeeObject = {};

  body.map((employee) => {
    defaultEmployeeObject[employee.id] = employee.fields;
  });

  try {
    for (const approve of approved) {
      if (approve.Employees[0] in defaultEmployeeObject) {
        const vacationFields = { [tableFields.status]: options.status.done };
        const newVacationTaken =
          approve.NumberOfVacationsRequest +
          defaultEmployeeObject[approve.Employees[0]].VacationsTaken;
        const remVac =
          defaultEmployeeObject[approve.Employees[0]].VacationsAllowed -
          newVacationTaken;
        const name = defaultEmployeeObject[approve.Employees[0]].Name;
        await sendEmailFunction(approve, remVac, name);
        const fields = { VacationsTaken: newVacationTaken };
        const recordsArray = [
          {
            id: approve.Employees[0],
            fields: fields,
          },
        ];
        const vacationsRecordsArray = [
          {
            id: approve.ID,
            fields: vacationFields,
          },
        ];
        await utilAirtable.update.records("Employees", recordsArray);
        await utilAirtable.update.records("Vacations", vacationsRecordsArray);
        defaultEmployeeObject[approve.Employees[0]].VacationsTaken =
          newVacationTaken;
      }
    }
    for (const reject of rejected) {
      const remVac =
        defaultEmployeeObject[reject.Employees[0]].RemainingVacations;
      const name = defaultEmployeeObject[reject.Employees[0]].Name;
      await sendEmailFunction(reject, remVac, name);
      const vacationFields = { [tableFields.status]: options.status.done };
      const vacationsRecordsArray = [
        {
          id: reject.ID,
          fields: vacationFields,
        },
      ];
      await utilAirtable.update.records("Vacations", vacationsRecordsArray);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = processingRequest;
