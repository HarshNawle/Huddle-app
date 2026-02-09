import Message from "../model/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";


export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body._id;
        

        if (!user1 || !user2) {
            return res.status(400).send("Both user ID's required.")
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });

        return res.status(200).json({ messages });
        
    } catch (error) {
        console.log({ error });
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const uploadFiles = async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).send("File is required");
        }
        const date = Date.now();
        // Store files under "uploads/files/<timestamp>/filename"
        const fileDir = `uploads/files/${date}`;
        const fileName = `${fileDir}/${req.file.originalname}`;

        mkdirSync(fileDir, { recursive: true });

        renameSync(req.file.path, fileName);

        // This relative path will be served by Express static middleware:
        // app.use("/uploads/files", express.static("uploads/files"));
        // Frontend should prefix with HOST, e.g. `${HOST}/${filePath}`
        return res.status(200).json({ filePath: fileName });
        
    } catch (error) {
        console.log({ error });
        return res.status(500).json({ message: "Internal Server Error" });
    }
};