import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendWhatsapp(to, body) {
  return client.messages.create({
    body,
    from: "whatsapp:+14155238886", // tu número de sandbox Twilio
    to: to
  });
}