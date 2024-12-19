const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmadmayallo02@gmail.com",
    pass: "bpqypaoyfrqzfsep",
  },
});

async function SendMail(email) {
  const OTP = randomstring.generate({ length: 4, charset: "numeric" });
  const mailOptions = {
    from: "ahmadmayallo02@gmail.com",
    to: email,
    subject: "Hello",
    text: `There is Your OTP Number To Confirm Your Account and Change Password Don't Share It With Anyone ${OTP}`,
  };
  transporter.sendMail(mailOptions, (error, info) =>
    error ? console.log(error) : console.log(`Email Sent Successfully`)
  );
  return OTP;
}

module.exports = SendMail;
