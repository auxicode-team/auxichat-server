import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Gender } from "../user.model";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender, {
    message: "Gender can only be 'male' or 'female' or 'other'",
  })
  gender: string;
}
