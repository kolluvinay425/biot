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
  console.log("filePath", filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log("err", err);
      // console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    }
    if (data) {
      console.log("data", data);

      const msg = {
        // to: recepient, //problem solved
        to: recepient,

        from: "lonelyvinay76@gmail.com",
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
