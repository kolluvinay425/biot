import mongoose from "mongoose";
import express from "express";
import userSchema from "./schema.js";
import appointmentSchema from "./appointmentSchema.js";
import bookingSchema from "./bookingSchema.js";
import { generateCalender } from "./utils/calender.js";
import { sendMail } from "./utils/mail.js";
import moment from "moment";
const userRouter = express();
userRouter.get("/app", async (req, res, next) => {
  try {
    const apps = await appointmentSchema.find();
    res.send(apps);
  } catch (error) {
    next("something wrong");
  }
});
userRouter.post("/app", async (req, res, next) => {
  try {
    const userData = {
      appointmentDate: req.query.date,
      startTime: req.query.start,
      endTime: req.query.end,
    };
    const postUser = new appointmentSchema(userData);
    const { appointmentDate, startTime, endTime } = await postUser.save();
    // let date = appointmentDate.toString();
    // date = date.replace("T00:00:00.000Z", " ");
    let d = new Date(appointmentDate);
    // console.log(d.getFullYear()); // Hours
    // console.log(d.getMonth());
    // console.log(d.getDate());
    const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const resData = {
      appointmentDate: date,
      startTime: startTime,
      endTime: endTime,
    };
    console.log("date here----------------->", date);
    res.send(resData);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const userData = {
      userName: req.query.username,
      email: req.query.email,
      phone: req.query.phone,
    };
    const postUser = new userSchema(userData);
    const saveUser = await postUser.save();
    res.send(saveUser);
  } catch (error) {
    next("something wrong");
  }
});
userRouter.get("/", async (req, res, next) => {
  try {
    const getUser = await userSchema.findOne({ userName: req.query.username });
    res.send(getUser);
  } catch (error) {
    next(error);
  }
});
userRouter.get("/all", async (req, res, next) => {
  try {
    const biotUsers = await userSchema.find();
    res.send(biotUsers);
  } catch (error) {
    next(error);
  }
});

// userRouter.get("/slot", async (req, res, next) => {
//   try {
//     const date = req.query.date;
//     console.log(req.query.date);
//     let [day, month, year] = date.split("/");
//     const checkDay = day.length < 2;
//     const checkMonth = month.length < 2;

//     if (checkDay & checkMonth) {
//       day = "0" + day;
//       month = "0" + month;
//       console.log("day", day);
//     } else if (checkDay) {
//       day = "0" + day;
//     } else if (checkMonth) {
//       month = "0" + checkMonth;
//     }

//     const result = [year, month, day].join("-");
//     console.log(result);
//     const apps = await appointmentSchema.find({
//       appointmentDate: result,
//     });

//     res.send(apps);
//   } catch (error) {
//     next(error);
//   }
// });
userRouter.get("/slot", async (req, res, next) => {
  try {
    const date = req.query.date;
    console.log(req.query.date);
    // let [day, month, year] = date.split("/");
    // const checkDay = day.length < 2;
    // const checkMonth = month.length < 2;

    // if (checkDay & checkMonth) {
    //   day = "0" + day;
    //   month = "0" + month;
    //   console.log("day", day);
    // } else if (checkDay) {
    //   day = "0" + day;
    // } else if (checkMonth) {
    //   month = "0" + checkMonth;
    // }

    // const result = [year, month, day].join("-");
    // console.log(result);
    const apps = await appointmentSchema.find({
      appointmentDate: date,
    });

    res.send(apps);
  } catch (error) {
    next(error);
  }
});

//book consultation
userRouter.post("/booking", async (req, res, next) => {
  try {
    const apps = await appointmentSchema.findById(req.query.appId);
    const bookingData = {
      userName: req.query.username,
      email: req.query.email,
      appointmentDate: apps.appointmentDate,
      startTime: apps.startTime,
      endTime: apps.endTime,
    };
    const book = new bookingSchema(bookingData);
    const saveBooking = await book.save();
    if (saveBooking) {
      const id = saveBooking._id;

      const calender = await generateCalender({ bookingData, id });
      const sendM = await sendMail(req.query.email, id);

      const deleteApp = await appointmentSchema.findByIdAndDelete(apps._id);
      res.send("booking successful");
    } else {
      res.send("something wrong");
    }
  } catch (error) {
    next(error);
  }
});
userRouter.get("/appointments", async (req, res, nex) => {
  try {
    const todayDate = moment().format("YYYY M D");
    // const v = moment("2022-04-11T00:00:00.000Z").format("YYYY M D");
    console.log("today", todayDate);
    const apps = await appointmentSchema.find({
      appointmentDate: { $gt: todayDate },
    });
    console.log(apps);

    if (apps) {
      // const appointmentDate = apps.appointmentDate.toString();
      res.send(apps);
    } else {
      res.send("No slots found");
    }
    console.log(apps);
    // res.send(apps);
    // if (v > todayDate) {
    //   res.send("hello");
    // } else {
    //   res.send("hiii");
    // }
  } catch (error) {}
});
export default userRouter;
