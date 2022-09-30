import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB 📁");
const handleError = (error) => console.log(`Error Connecting to DB: ${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
