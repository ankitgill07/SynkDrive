import nodemailer from "nodemailer";
import { getEmailTemplate } from "./getEmailTemplate.js";

const testAccount = nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "sanford.fay@ethereal.email",
    pass: "a9cghhtftjc4UW9JfY",
  },
});

export const sendInviteEmail = async (email, file, permission, user, url) => {
  const htmlContent = getEmailTemplate({
    user,
    file,
    permission,
    url,
  });

  const mailOptions = {
    from: `${user.name} (via SynkDrive)  <no-reply@hirepath.store>`,
    to: email,
    subject: `${user.name} shared ${file.name} with you`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};
