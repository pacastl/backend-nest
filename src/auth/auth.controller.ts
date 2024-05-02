import { Request,Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { log } from 'console';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';

// esta es la URL
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    return this.authService.create(createUserDto);
  }

  // Subruta para el login
  @Post('/login')
  login( @Body() loginDto: LoginDto  ) {
    return this.authService.login( loginDto );
  }

  @Post('/register')
  register( @Body() registerDto: RegisterUserDto  ) {
    return this.authService.register( registerDto );
  }

  // Implementamos un guard
  @UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request ) {
    // const user = req['user'];
    
    // return user;
    return this.authService.findAll();
  }

   // LoginResponse
   @UseGuards( AuthGuard )
   @Get('check-token')
   checkToken( @Request() req: Request ): LoginResponse {
       
     const user = req['user'] as User;
 
     return {
       user,
       token: this.authService.getJwtToken({ id: user._id })
     }
 
   }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
