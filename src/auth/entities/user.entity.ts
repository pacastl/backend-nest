import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    // Lo crea automáticamente.
    // No creo la propiedad, solo digo que algunos obejtos tienen id
    _id?:string;

    // Prop es propiedad. Lo ponemos porque queremos grabarlas en la BD
    // unique es para que no haya 2 usuarios con el mismo email
    // cuando ponemos unique:true, automáticamente crea un index para poder buscarlo rápido
    // y el required es para que el email sea obligatorio
    @Prop({unique:true,required:true})
    email: string;

    @Prop({required:true})
    name: string;

    @Prop({minlength:6,required:true})
    password?: string;

    // Le pone valor por defecto a true
    @Prop({default:true})
    isActive: boolean;

    // Es un tipo array de string y el valor por defecto es un array vacío
    @Prop({type:[String],default:['user']})
    roles: string[];
}
// Exportamos el schema para que se cree su definición en la Base de datos
export const UserSchema= SchemaFactory.createForClass(User);