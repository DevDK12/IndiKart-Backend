export type genderTypes = "male" | "female";
export type roleTypes = "admin" | "user";






export interface IUser {
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





export interface postRegisterUserTypes {

    name: string,
    email: string,
    password: string,
    user: string,
    photo: string,
    gender: genderTypes,
    _id: string,
    dob: Date,
}
