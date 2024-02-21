import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import doritorysRoute from "./routes/dormitorys.js"
import cookieParser from "cookie-parser"
import cors from "cors"

import reservationRoute from "./routes/reservation.js"
import adminRouter from "./routes/admin.js";

const app = express();

dotenv.config();


app.get('/', (req, res) => {
    try {
        Image.find({}).then(data => {
            res.json(data)
        }).catch(error => {
            res.status(408).json({error})
        })
    } catch (error) {
        res.json({ error });
    }
});

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB.")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};


mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!")
})

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!")
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/dormitorys", doritorysRoute);
app.use("/api/reservation", reservationRoute);

app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error!"
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});


const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});