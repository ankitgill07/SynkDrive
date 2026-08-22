import nodemailer from "nodemailer";
import { getEmailTemplate } from "./getEmailTemplate.js";



const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "ankit930k@gmail.com",
    pass: "kluqtczvsqmuixmd",
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
