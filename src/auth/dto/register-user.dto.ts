import { IsEmail, IsString, MinLength } from "class-validator";

// Puede parecer que hemos duplicado create-user pero en verdad
// así nos aseguraamos que si en el futuro cambia el registro 
// nuestarc reación de usuario no se ve afectada
export class RegisterUserDto {

    @IsEmail() 
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
    
    
}
