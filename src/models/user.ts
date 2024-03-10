import mongoose from "mongoose";
import validator from "validator";

import {IUser, genderTypes, roleTypes} from "../types/UserTypes.js";
import { Model } from "mongoose";



const Schema = mongoose.Schema;


interface UserModel extends Model<IUser> {
    getMonthUsers : ({start, end}: {start: Date, end: Date}) => Promise<any>,
}





const UserSchema = new Schema<IUser, UserModel>({
    _id: {
        type: String,
        required: [true, 'ID is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validator: validator.default.isEmail,
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
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





//_ Static Methods
UserSchema.static('getMonthUsers', ({start, end}) => {
    return User.find({
        createdAt: {
            $gte: start,
            $lte: end,
        },
    });
});




const User = mongoose.model<IUser, UserModel>('User', UserSchema);


export default User;


