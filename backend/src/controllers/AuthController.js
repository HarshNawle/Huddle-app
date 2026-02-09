import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { mkdirSync, renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;


const createToken = (email , userId ) => {
    return jwt.sign({ email, userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: maxAge
    })
}

export const signup = async (req,res,next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ 
                message: "Email and password are required",
                success: false,
             });
        }

        const user = await User.create({ email, password});
        res.cookie("jwt", createToken(email, user._id), {
            maxAge, secure:true, sameSite: "none"
        });
        return res.status(201).json({ user: {
            _id: user._id,
            email: user.email,
            profileSetup: user.profileSetup
        } })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ 
                message: "Email and password are required",
                success: false,
             });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).send("User not Found");
        }

        const auth = await compare(password, user.password);
        if(!auth){
            return res.status(200).send("Invalid Password")
        }

        res.cookie("jwt", createToken(email, user._id), {
            maxAge, secure:true, sameSite: "none"
        });
        return res.status(201).json({ user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            profileSetup: user.profileSetup
        } })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
} ;

export const getUserInfo = async (req, res) => {
    try {
        const userData = await User.findById(req.userId);
        if(!userData) {
            return res.status(404).send("user with the given ID not found");
        }

        return res.status(200).json({
            user: {
                _id: userData._id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                profileSetup: userData.profileSetup
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
} ;

export const updateProfile = async (req, res) => {
    try {
        const {userId } = req;
        const { firstName, lastName } = req.body;
        
        if(!firstName || !lastName) {
            return res.status(400).send("Firstname and Lastname is required");
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                profileSetup: true
            },
            {new: true , runValidators: true}
        )

        return res.status(200).json({
            user: {
                _id: userData?._id,
                email: userData?.email,
                firstName: userData?.firstName,
                lastName: userData?.lastName,
                image: userData?.image,
                profileSetup: userData?.profileSetup
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
} ;

export const addProfileImage = async (req,res,next) => {
    try {
        if(!req.file) {
            return res.status(400).send("File is required.");
        }

        const date = new Date().toISOString().replace(/[:.]/g, "-");

        // Ensure upload directory exists
        const uploadDir = "uploads/profiles";
        mkdirSync(uploadDir, { recursive: true });

        const fileName = `${uploadDir}/${date}-${req.file.originalname}`;
        renameSync(req.file.path, fileName);

        const updateUser = await User.findByIdAndUpdate(
            req.userId,
            { image: fileName },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ image: updateUser?.image });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const removeProfileImage = async (req,res,next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.image) {
            try {
                unlinkSync(user.image);
            } catch (e) {
                console.log("Error deleting image file:", e);
            }
        }

        user.image = null;
        await user.save();

        return res.status(200).json({ image: null });
    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
};

export const logout = async (req,res,next) => {
    try {
        res.cookie("jwt", "", { 
            maxAge: 1, 
            secure: true, 
            sameSite: "none",
            httpOnly: true
        });
        return res.status(200).json({ 
            message: "Logout successfully",
            success: true
        });
    } catch (error) {
        console.log({error});
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

