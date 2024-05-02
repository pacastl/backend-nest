export interface JwtPayload{
    // Siempre vamos a necesitar el id porque necesitamos saber qué usuario
    id:string;
    //  fecha de creación
    iat?:number;
    // fecha de expiración
    exp?:number
}