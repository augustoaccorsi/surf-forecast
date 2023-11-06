import { User } from '@src/models/user';
import AuthService from '@src/services/authservices';

describe('User functional tests', () => {
    beforeAll(async () => await User.deleteMany({}));
    describe('when creating a new user', () => {
        it('should successfuly create a new user with encrypted password', async () => {
            const newUser = {
                name: 'Mock User',
                email: 'mock@mail.com',
                password: '12345',
            };

            const response = await global.testRequest.post('/users').send(newUser);
            expect(response.status).toBe(201);
            await expect(
                AuthService.comparePasswords(newUser.password, response.body.password)
            ).resolves.toBeTruthy();
            expect(response.body).toEqual(
                expect.objectContaining({
                    ...newUser,
                    ...{ password: expect.any(String) },
                })
            );
        });

        it('should return 422 when there is a validation error', async () => {
            const newUser = {
                email: 'john@mail.com',
                password: '1234',
            };

            const response = await global.testRequest.post('/users').send(newUser);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                code: 422,
                error: 'User validation failed: name: Path `name` is required.',
            });
        });

        it.skip('should return 500 when there is any error other than validation error', async () => {
            //TODO think in a way to throw a 500
        });

        it('should return 409 when the email already exists', async () => {
            const newUser = {
                name: 'Mock User',
                email: 'mock@mail.com',
                password: '12345',
            };

            await global.testRequest.post('/users').send(newUser);
            const response = await global.testRequest.post('/users').send(newUser);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                code: 409,
                error: 'User validation failed: email: already exists in the database.',
            });
        });
    });
});
