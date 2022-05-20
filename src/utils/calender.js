import ics from "ics";
import fs from "fs";
import { join } from "path";
import { promisify } from "util";
import { pipeline } from "stream";

const publicFolderPath = join(process.cwd(), "public");
console.log(publicFolderPath);

export const generateCalender = async ({ bookingData, id }) => {
  const asyncPineline = promisify(pipeline);
  let d = new Date(bookingData.appointmentDate);
  let date = bookingData.appointmentDate.toString();
  const udate = date.replace("T00:00:00.000Z", " ");
  console.log("api date", udate); // Hours
  // console.log(d.getMonth());
  // console.log(d.getDate());
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  console.log("year--->", year);
  console.log("month----->", month);
  console.log("dat------->", day);

  //   Kconsole.log(typeof startTime);
  const startTimee = bookingData.startTime.toString().slice(0, 2);
  const endTimee = bookingData.startTime.toString().slice(3, 5);
  console.log("full time:------->", startTimee, endTimee);
  console.log(
    "here in generate calender func",
    bookingData,
    "ending here------------>"
  );
  const event = {
    start: [year, month, day, parseInt(startTimee), parseInt(endTimee)],
    duration: { hours: 0, minutes: 30 },
    title: "Bio-T consultation",
    description: "Free Consultation",
    // location: "Bari",
    url: "https://biot.it/",
    geo: { lat: 41.11148, lon: 16.8554 },
    categories: ["Health", "Technology"],
    status: "CONFIRMED",
    busyStatus: "BUSY",
    organizer: { name: "Admin", email: "ingegneria@biot.it" },
    // attendees: [
    //   {
    //     name: "Adam Gibbons",
    //     email: "adam@example.com",
    //     rsvp: true,
    //     partstat: "ACCEPTED",
    //     role: "REQ-PARTICIPANT",
    //   },
    // ],
  };
  ics.createEvent(event, (error, value) => {
    if (error) {
      console.log("errrrrrrrrrr", error);
    }
    // const newFileName = `${booking._id}.pdf`;
    const newFileName = `${id}.ics`;

    const filePath = join(publicFolderPath, newFileName);
    // asyncPineline(value, fs.createWriteStream(filePath));
    fs.writeFileSync(filePath, value);
    // console.log("buffer fileeeeeeee", value);
  });
};
