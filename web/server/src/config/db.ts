import mongoose from "mongoose";

const connectWithAtlas = async (retries: number) => {
    while (retries) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URL as string);
            console.log(`MongoDB connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`MongoDB retry connection failed (${retries})`, error);

            retries--;

            // waiting for 5s before trying again
            await new Promise((res) => setTimeout(res, 5000));
        }
    }

    // killing the app db fails
    process.exit(1);
};

export default connectWithAtlas;
