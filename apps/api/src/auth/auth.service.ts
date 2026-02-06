import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        return null; // Not used for OAuth/Test login
    }

    async login(loginDto: LoginDto) {
        let providerId = '';
        let email = '';

        if (loginDto.provider === 'test') {
            // Mock verification
            providerId = 'test-user-id';
            email = 'test@example.com';
        } else {
            // TODO: Implement Apple/Google verification
            throw new UnauthorizedException('Provider not implemented yet');
        }

        let user = await this.usersService.findByProvider(loginDto.provider, providerId);
        if (!user) {
            user = await this.usersService.create({
                provider: loginDto.provider,
                providerId,
                email,
            });
        }

        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
