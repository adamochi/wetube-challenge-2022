import "dotenv/config";
import "./mango"; // If you import the file, JavaScript will execute that automatically
import "./models/Video"; // we do this after we import database
// import "./models/User";
import app from "./server";

const PORT = 4001;

const handleListening = () => {
  console.log(`🍣 Server is listening - http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
