import mongoose from "mongoose";
import validator from "validator";

import {genderTypes, roleTypes} from "../types/types.js";



const Schema = mongoose.Schema;



interface UserTypes {
    // _id: mongoose.Schema.Types.ObjectId;
    _id: string;
    image: string;
    username: string;
    password: string;
    email: string;
    role: roleTypes;
    gender: genderTypes;
    dob: Date;
    createdAt: Date;
    updatedAt: Date;

    // Virtuals
    age: number;
}



const UserSchema = new Schema({
    _id: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: [true, 'ID is required'],
    },

    image: {
        type: String,
        required: [true, 'Image is required'],
    },

    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already exist'],
        validator: validator.default.isEmail,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
    },
    dob: {
        type: Date,
        required: [true, 'Date of Birth is required'],

    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
},

    {
        timestamps: true
    }
)


UserSchema.virtual('age').get(function () {
    const today = new Date();
    const dob = this.dob as Date;
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});


const User = mongoose.model<UserTypes>('User', UserSchema);


export default User;


