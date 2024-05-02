import { User } from "../entities/user.entity";

export interface LoginResponse{
    // En typescript podemos usar las clases como un tipo de dato
    user:User;
    token:string
}