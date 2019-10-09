const sgMail = require('@sendgrid/mail');
const { logGenerator } = require('../logger/logGenerator');

module.exports = {
  sendEmail(senderEmail, receiversEmail, message) {
    const messages = receiversEmail.map(email => ({
      to: email,
      from: senderEmail,
      templateId: process.env.TEMPLATE_ID,
      dynamic_template_data: {
        ...message,
      },
      substitutionWrappers: {},
    }));

    sgMail.send(messages, err => {
      if (err) logGenerator({ err, isDuplicate: true });
    });
  },
  sendInterestedMail(senderEmail) {
    const { INTERESTED_EMAIL, SENDGRID_API_KEY } = process.env;
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: INTERESTED_EMAIL,
      from: senderEmail,
      subject: 'Hey I am interested!',
      html: `<strong>Hey my email is ${senderEmail}, and I am interested in checkass!!!<strong>`,
    };

    sgMail.send(msg);
  },
};
