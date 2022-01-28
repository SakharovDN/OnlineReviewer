import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

export class CreateOrLoginUserDto {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6,15)
    @Transform(({ value }: TransformFnParams) => value = typeof value === "string" ? value.trim() : value)
    readonly password: string;
}