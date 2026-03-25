import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentEmails(
  senderEmail: string,
  receiverEmail: string,
  amount: number
) {
  try {
    console.log("📧 Sending emails...");

    const senderRes = await resend.emails.send({
      from: "PaytmClone <onboarding@resend.dev>",
      to: senderEmail,
      subject: "Payment Sent",
      html: `<p>You sent ₹${amount} successfully.</p>`
    });

    console.log("Sender email result:", senderRes);

    const receiverRes = await resend.emails.send({
      from: "PaytmClone <onboarding@resend.dev>",
      to: receiverEmail,
      subject: "Payment Received",
      html: `<p>You received ₹${amount} successfully.</p>`
    });

    console.log("Receiver email result:", receiverRes);

  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
}