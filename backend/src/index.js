import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./DB/connectDB.js";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoute.js";
import setupSocket from './socket.js'
import http from 'http';
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";


dotenv.config();
const app = express();

const server = http.createServer(app);

// Static file serving
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
// Backwards compatibility for older uploaded files (saved under "upload/files")
app.use("/upload/files", express.static("upload/files"));

//Middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))


app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/channel', channelRoutes);

const PORT = process.env.PORT;


server.listen(PORT, () => {
    connectDB();
    console.log("Server started");
});

setupSocket(server);

