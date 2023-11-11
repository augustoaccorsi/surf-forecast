import { User } from '@src/models/user';
import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';

export interface DecodedUser extends Omit<User, '_id'> {
    id: string;
}

export default class AuthService {
    public static async hashPassword(
        password: string,
        salt = 10
    ): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public static generateToken(payload: object): string {
        const secret: jwt.Secret = config.get('App.auth.key');
        return jwt.sign(payload, secret, { expiresIn: config.get('App.auth.tokenExpiresIn') });
    }

    public static decodeToken(token: string): DecodedUser {
        const secret: jwt.Secret = config.get('App.auth.key');
        return jwt.verify(token, secret) as DecodedUser;
    }
}
