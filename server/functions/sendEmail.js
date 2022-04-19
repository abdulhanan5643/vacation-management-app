const sgMail = require("@sendgrid/mail");
const { emailApiKey } = require("../common/commonVariables");

const sendEmailFunction = async (request, RemainingVacations, name) => {
  request.RemainingVacations = RemainingVacations;
  request.Name = name;
  sgMail.setApiKey(emailApiKey);
  const msg = {
    to: request.Email,
    from: "wesseanllc@gmail.com",
    templateId: "d-28da22ced93c4481ac7430267b6390bd",
    dynamic_template_data: request,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendEmailFunction;
