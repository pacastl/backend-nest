import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(), // PAra las variables de entorno del .env
    MongooseModule.forFeature([{ 
      // Expongo User para que lo cree en la BD de Mongo (al recargar Mongo, lo crea)
      name: User.name, 
      schema: UserSchema }
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' }, //Expira en 6 horas
    }),
  ],
})
export class AuthModule {}
