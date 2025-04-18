import { mailTransporter } from "../config/nodemailer.config.js";
import CustomError from "../errors/customError.js";

export const sendMail = async (to, subject, text) => {
  try {
    await mailTransporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html: text,
    });
  } catch (error) {
    console.error("Error in sending mail: ", error);
    throw new CustomError("Error in sending mail", 500);
  }
}

//sendMail("deepshekhawat@gmail.com", "Test", `<h1>this is a test mail click on <a href="https://google.com"> click me!! </a></h1>`); // Test mail