// root
import app from "./app";
import dotenv from "dotenv";
import connectWithAtlas from "./config/db";
import mongoose from "mongoose";

// global .env config
dotenv.config();

// showing mongo queries in dev env only
if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
}

const port = process.env.PORT || 8080;
const retries = 5;

(async function () {
    await connectWithAtlas(retries);

    app.listen(port, () => {
        console.log(`SERVER LISTENING ON PORT: ${port}`);
    });
})();
