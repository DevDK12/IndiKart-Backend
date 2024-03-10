export type genderTypes = "male" | "female";
export type roleTypes = "admin" | "user";



export interface postLoginUserTypes {

    email: string,
    password: string,
}



export interface postRegisterUserTypes extends postLoginUserTypes {

    _id: string,
    name: string,
    user: string,
    image: string,
    gender: genderTypes,
    dob: Date,
}






export interface IUser extends postRegisterUserTypes {
    role: roleTypes;
    createdAt: Date;
    updatedAt: Date;

    // Virtuals
    age: number;
}





