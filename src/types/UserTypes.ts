export type genderTypes = "male" | "female";
export type roleTypes = "admin" | "user";


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
