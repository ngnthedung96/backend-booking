import nodeMailer from "nodemailer";
const sendMail = async (to, subject, htmlContent) => {
  // const transporter = nodeMailer.createTransport({
  //   host: process.env.SMPT_HOST,
  //   port: process.env.SMPT_PORT,
  //   // service: process.env.SMPT_SERVICE,
  //   // auth: {
  //   //   user: process.env.SMPT_MAIL,
  //   //   pass: process.env.SMPT_PASSWORD,
  //   // },
  //   tls: {
  //     rejectUnauthorized: false,
  //   },
  // });
  var transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 25,
    secure: false,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_APP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

export { sendMail };
