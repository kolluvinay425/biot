import mongoose from "mongoose";

const { model, Schema } = mongoose;

const appSchema = new Schema(
  {
    appointmentDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("appointment", appSchema);
