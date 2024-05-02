import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Para las variables de entorno
    ConfigModule.forRoot(),

    // Nos conectamos a esta base de datos mongo
    MongooseModule.forRoot(process.env.MONGO_URI),
    
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log(process.env);
  }
}
