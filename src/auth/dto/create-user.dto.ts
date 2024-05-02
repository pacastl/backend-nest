import { IsEmail, IsString, MinLength } from "class-validator";

// Con las validaciones de aquí NO me tengo que precoucpar cómo le llega la data a mi servicio
// porque si no lo cumple lo de aquí NO acepta la data
export class CreateUserDto {
    // Aquí también podemos añadir validaciones
    @IsEmail() // Es para validar que tenga formato de email y si no lo cumple NO lo acepta 
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
    
    // Por defecto está activo el isActive asú que no necesito pasarlo

    // Los roles ya los podré actualizar después, no me interesa al crearlos
}
