import { Resend } from "resend";
import { Item, Status } from "./appendStatus";
import DefaultTemplate from "../emails/default-template.tsx";

export const sendNotification = async (
  resendApiKey: string,
  receiverTo: string,
  attractionsWithStatus: (Item & {
    status?: Status;
  })[],
) => {
  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: "Rob van Bakel <ping@robvanbakel.com>",
    replyTo: "info@robvanbakel.com",
    to: receiverTo,
    subject: "Update: Efteling Onderhoudskalender",
    react: <DefaultTemplate attractions={attractionsWithStatus} />,
  });
};
