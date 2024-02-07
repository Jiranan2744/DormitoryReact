import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import roomsRoute from "./routes/rooms.js"
import usersRoute from "./routes/users.js"
import doritorysRoute from "./routes/dormitorys.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

dotenv.config();

//http://localhost:8080
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
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB.")
    } catch (error) {
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
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/dormitorys", doritorysRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error!"
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });

});

app.listen(8080, () => {
    connect()
    console.log("Connected to backend.");
});