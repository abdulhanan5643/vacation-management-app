const utilAirtable = require('util992/functions/airtable');

const employeeListFunction = async () => {
    try {
        const { body } = await utilAirtable.get.records('Employees')
        const employees = body.map(emp => { return { name: emp.fields.Name, id: emp.id } })
        return employees;
    }
    catch (err) { return err }
}

module.exports = employeeListFunction;