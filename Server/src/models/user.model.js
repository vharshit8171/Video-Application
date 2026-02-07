import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: [true, "username is requried"] },
        email: { type: String, required: [true, "email is requried"], unique: [true, "email should be unique"] },
        password: { type: String, min: [4, "min lenght requried is 4"], max: [20, "max lenght is 8"], required: [true, "password is requried"] },
        location: { type: String, required: true },
        contact_number: { type: String, required: [true, "number is requried"], unique: true },
        avatar: { type: String, required: true },
        avatarPublicId: {type:String},
        channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", unique: true, sparse: true },
        watchHistory: [{
            video: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"},
            watchedAt: {
                type: Date,
                default: Date.now}
        }],
        refreshToken: { type: String }
    },
    { timestamps: true });

userSchema.pre('save', async function (next) {
    // Second make this function as normal not arrow because in arrow function this scope is always referrs to parent. 
    // This function should run only when new user register or existing user modifies its password only so we have to add the follwing check condition as-  
    if (!this.isModified('password')) return next();
    // We want to save the password of the user in the encypted form so no one else uses or steals the password by hacking our database so we uses this bcypt library.
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
userSchema.methods.ispasswordCorrect = async function (password) {
    // This function checks is the password given by user is valid or not so we simply add this method into our userSchema 
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.genrateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}
userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

export const User = mongoose.model("User", userSchema);