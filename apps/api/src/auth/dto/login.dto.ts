import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['apple', 'google', 'test'])
    provider: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
