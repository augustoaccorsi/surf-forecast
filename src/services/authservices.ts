import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

export default class AuthService {
    public static async hashPassword(password: string, salt = 10): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public static generateToken(payload: object): string {
        
        /*
        const key = config.get('App.auth.key');
        const expiresIn = config.get('App.auth.tokenExpiresIn');
        return jwt.sign(payload, key, { expiresIn: expiresIn });
        */
        return jwt.sign(payload, 'test', { expiresIn: 10000 });


        /*
        
        return jwt.sign(payload, key, { expiresIn: expiresIn }); */
    }
}

