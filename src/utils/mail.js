import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";
sgMail.setApiKey(process.env.MY_SENDGRED_API_KEY);
const publicFolderPath = path.join(process.cwd(), "public");

export const sendMail = async (recepient, id) => {
  console.log("im here", recepient);
  //   console.log(recepient);
  //   console.log("kolluvinay425@gmail.com");
  //   const newFileName = `${id}.pdf`;
  const newFileName = `${id}.ics`;

  const filePath = path.join(publicFolderPath, newFileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log("err", err);
    }
    if (data) {
      const msg = {
        to: recepient,
        from: "serena_chatbot@biot.it",
        subject: "Attachment",
        html: "<strong>your consultation with biot successful!</strong>",
        attachments: [
          {
            content: data.toString("base64"),
            filename: "invite.ics",
            type: "application/ics",
            disposition: "attachment",
            content_id: "mytext",
          },
        ],
      };
      sgMail.send(msg);
    }
  });
};
