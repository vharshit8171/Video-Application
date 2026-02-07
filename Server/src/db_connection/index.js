import mongoose from 'mongoose';
// import 'dotenv/config'

// DB is places in another continet so always follow two practices i.e wrap your code inside try and catch or its a connection request so uses async await.
const dbConnection = async() => {
    try {
         const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL} / ${process.env.DB_Name}`)
         console.log("DB connection successfully done!!!",connectionInstance.connection.host);
    } catch (error) {
        // throw error;
        console.log("DB connection failed!!!",error);
        process.exit(1)
    }
}

export default dbConnection