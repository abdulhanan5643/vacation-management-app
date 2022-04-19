const port = process.env.PORT;
const apiKey = process.env.API_SECRET_KEY;
const baseId = process.env.BASE_ID;
const emailApiKey = process.env.SENDGRID_API_KEY;

const options = {
    response: {
        approve: "Approved",
        rejected: "Rejected",
        waiting_decision: "Waiting Decision",
    },
    status: {
        done: "Done",
        error: "Error",
        in_progress: "In progress",
    }
};

const tableFields = {
    name: "Name",
    start_date: "StartDate",
    end_date: "EndDate",
    reason: "VacationReason",
    comment: "RequestComments",
    responseComments: "ResponseComments",
    email: "Email",
    status: "Status",
    response: "Response",
    employee: "Employees",
    vacationsRequested: "NumberOfVacationsRequest",
}

const sendError = (status, error, message, path) => {
    const errorObject = {
        timestamp: new Date,
        status: status,
        error: error,
        message: message,
        path: path,
    }
    return errorObject;
}

module.exports = {
    port,
    apiKey,
    baseId,
    emailApiKey,
    sendError,
    tableFields,
    options,
}