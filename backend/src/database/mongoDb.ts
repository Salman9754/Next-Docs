import mongoose from "mongoose";
import { DB_URI } from "../config/env";

if (!DB_URI) {
    throw new Error("Please define the mongoDb URI in env file");
}

const connectionToDB = async () => {
    try {
        await mongoose.connect(DB_URI ?? "")
        console.log("connected to MongoDB Database");

    } catch (error) {
        console.log(error);

    }
}

export default connectionToDB