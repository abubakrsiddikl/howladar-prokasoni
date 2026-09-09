// /* eslint-disable @typescript-eslint/no-explicit-any */
// import ejs from "ejs";
// import path from "path";
// import { Resend } from "resend";
// import { envVars } from "../config/env";
// import AppError from "../errorHelper/AppError";

// const resend = new Resend(envVars.EMAIL_SENDER.RESEND_API_KEY);

// interface SendEmailOptions {
//   to: string;
//   subject: string;
//   templateName: string;
//   templateData?: Record<string, any>;
//   attachments?: {
//     filename: string;
//     content: Buffer | string;
//     contentType: string;
//   }[];
// }

// export const sendEmail = async ({
//   to,
//   subject,
//   templateName,
//   templateData,
//   attachments,
// }: SendEmailOptions) => {

//   console.log("to",to)
//   try {
//     const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
//     const html = await ejs.renderFile(templatePath, templateData);
//     const { data, error } = await resend.emails.send({
//       from: envVars.EMAIL_SENDER.FROM,
//       to,
//       subject,
//       html,
//       attachments: attachments?.map((attachment) => ({
//         filename: attachment.filename,
//         content: attachment.content,
//       })),
//     });

//     if (error) {
//       throw error;
//     }

//     console.log(`\u2709\uFE0F Email sent to ${to}: ${data?.id}`);
//   } catch (error: any) {
//     console.log(error);
//     console.log("email sending error", error.message);
//     throw new AppError(401, "Email error");
//   }
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import path from "path";
import { Resend } from "resend";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";

const resend = new Resend(envVars.EMAIL_SENDER.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[]; 
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions) => {
  // console.log("to", to);
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    const recipientList =
      typeof to === "string" ? to.split(",").map((email) => email.trim()) : to;

    const { error } = await resend.emails.send({
      from: envVars.EMAIL_SENDER.FROM,
      to: recipientList,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
      })),
    });

    if (error) {
      throw error;
    }

    // console.log(`✉️ Email sent to ${recipientList.join(", ")}: ${data?.id}`);
    console.log("✉️ Email sent successfully ✅");
  } catch (error: any) {
    console.log(error);
    console.log("email sending error", error.message);
    throw new AppError(401, error.message || "Email error");
  }
};
