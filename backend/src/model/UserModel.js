import bcrypt from "bcrypt";
import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    } ,
    password:{
        type: String,
        required: true,
    } ,
    firstName:{
        type: String,
        required: false,
    } ,
    lastName:{
        type: String,
        required: false,
    } ,
    image:{
        type: String,
        required:false,
    } ,
    profileSetup:{
        type: Boolean,
        default: false,
    } ,
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;