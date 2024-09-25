import mongoose from "mongoose";

export async function connect() {
    try {

        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.once('connected', () => {
            console.log('MongoDB database connection established successfully');
        });

        connection.on('error', (error) => {
            console.log('MongoDB database connection error');
            console.log(error);
            process.exit(1);
        });

    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);

    }
}