import { sender,resend } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";
import "dotenv/config"

export async function sendEmail(toEmail,name,client_url) {
  console.log(`${sender.name} <${sender.email}>`);
  console.log(toEmail);
  const { data, error } = await resend.emails.send({
    from:'Acme <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Hello World',
    html: createWelcomeEmailTemplate(name,client_url),
  });
  console.log(data);
  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};