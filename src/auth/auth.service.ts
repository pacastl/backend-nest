import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {

  // Con este modelo ya puedo interactar con la base de datos relacionado
  //  con todo lo que tenga definido en el esquema
  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,

    private jwtService: JwtService,
   ) {}

  //  En createUserDto tenemos toda la data del usuario (email, contraseña...)
  async create(createUserDto: CreateUserDto): Promise<User> {
    // const newUser=new this.userModel(createUserDto);
    // return newUser.save();

    // Cualquier error lo atrapo en el catch
    try {
      // Desestructuramos el password y el resto en otra variable 
      const { password, ...userData } = createUserDto;    
      //  1. Encriptar la password (para que auque se obtenga la contraseña no se pueda ver por estar cifrada)
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ), //Encriptamos la contraseña
        ...userData
      });
      //  2. Crear el usuario
      //  3. Generar el JWT
      await newUser.save();
      // Eliminamos la contraseña encriptada al devolver los datos del usuario creado
      // password:_ es para que no choque con la variable password del mismo nomnbre
      const { password:_, ...user } = newUser.toJSON();
       return user;
    } catch (error) {
      // Sabemos que es el error 11000 (duplicado) porque sale en la consola 
      // al intentar insertar un usuario que ya existe con Postman
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      // Otro error
      throw new InternalServerErrorException('Something terribe happened!!!');

    }

  }

  async register( registerDto: RegisterUserDto ): Promise<LoginResponse> {
    // En este caso, register cumple los requisitos para ser tratado como un login o  un createUserDto
    // por eso basta con simplemente registerDto 
    const user = await this.create( registerDto );
    // console.log({user})
    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }
   
  async login( loginDto: LoginDto ):Promise<LoginResponse> {
    /* Devuelve:
    User --> {_id,name,email.roles}
    Token-> ashduashdadn.adknasndasd.asdkasdkas
    */

    // Extraemos el usuario y la password
    const { email, password } = loginDto;
    // Comprobamos que el usuario que existe
    const user = await this.userModel.findOne({ email });
    // Si no existe el usuario, devolvemos un error
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }

    // Verificamos la contraseña hasheada
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    // Respuesta en caso de que el usuario y la contraseña son correctos
    const { password:_, ...rest  } = user.toJSON();

      
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    // Quitamos la contraseña
    const { password, ...rest } = user.toJSON();
    return rest;
  }
  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload:JwtPayload){
    // Lo podemos hacer síncrono o con el await
    const token = this.jwtService.sign(payload);
    return token;
  }
}