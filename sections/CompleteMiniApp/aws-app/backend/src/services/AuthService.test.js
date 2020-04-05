const AuthService = require('./AuthService');
//const AWS = require('aws-sdk-mock');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
    const mockedCognitoIdentityServiceProvider = {
        signUp: jest.fn(),
        adminAddUserToGroup: jest.fn(),
        initiateAuth: jest.fn()
    };
    const mockedConfig = {
        update: jest.fn()
    };
    return {
        CognitoIdentityServiceProvider: jest.fn(() => mockedCognitoIdentityServiceProvider),
        config: mockedConfig
    };
});

Object.assign(process.env, {
    COGNITO_USER_POOL_CLIENT_ID: 'userpoolclientid',
    COGNITO_DEFAULT_USER_GROUP_NAME: 'usergroupname',
    COGNITO_USER_POOL_ID: 'userpoolid'
});

describe('Tests AuthService', () => {

    let cognitoIdentityServiceProvider;

    beforeAll(done => {
        done();
    })

    beforeEach((done) => {
        cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
        done();
    });

    afterEach(done => {
        done();
    });

    afterAll(done => {
        done();
    });

    describe('Tests Register', () => {
        it('ERROR 400: Sign Up fails', async () => {
            const data = {
                email: 'test@test.com',
                password: '1234'
            };

            cognitoIdentityServiceProvider.signUp.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await AuthService.register(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400,
                    message: 'Error during signup'
                });
            }
        });

        it('ERROR 400: Adding user to group fails', async () => {
            const data = {
                email: 'test@test.com',
                password: '1234'
            };

            cognitoIdentityServiceProvider.signUp.mockImplementation(async (_, cb) => cb(false, {}));
            cognitoIdentityServiceProvider.adminAddUserToGroup.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await AuthService.register(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400,
                    message: 'Error adding user to group'
                });
            }
        });

        it('SUCCESS: Signed Up and added user to group', async () => {
            const data = {
                email: 'test@test.com',
                password: '1234'
            };

            const dataSignUp = {
                test: 'test'
            };

            cognitoIdentityServiceProvider.signUp.mockImplementation(async (_, cb) => cb(false, dataSignUp));
            cognitoIdentityServiceProvider.adminAddUserToGroup.mockImplementation(async (_, cb) => cb(false, {}));

            try {
                const res = await AuthService.register(data);
                expect(res).toEqual(dataSignUp);
            } catch(err) {
                
            }
        });
    });

    describe('Tests Login', () => {
        it('ERROR 400: Email or/and password is missing', async () => {
            const data = {
                email: 'test@test.com'
            };

            try {
                const res = await AuthService.login(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400, 
                    message: 'email or password is missing'
                });
            }
        });

        it('ERROR 403: Initiating authentication fails', async () => {
            const data = {
                email: 'test@test.com',
                password: '1234'
            };

            cognitoIdentityServiceProvider.initiateAuth.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await AuthService.login(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 403, 
                    message: 'An error happened during the authentication'
                });
            }
        });

        it('SUCCESS: Authentication was correct', async () => {
            const data = {
                email: 'test@test.com',
                password: '1234'
            };

            const expectedResponse = {
                testAtt: 'test'
            };

            cognitoIdentityServiceProvider.initiateAuth.mockImplementation(async (_, cb) => cb(false, expectedResponse));

            try {
                const res = await AuthService.login(data);
                expect(res).toEqual(expectedResponse);
            } catch(err) {
                
            }
        });
    });

    describe('Tests Refresh Token', () => {
        it('ERROR 400: Refresh token is missing', async () => {
            const data = {};

            try {
                const res = await AuthService.refreshToken(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400, 
                    message: 'Refresh Token is missing'
                });
            }
        });

        it('ERROR 403: Authentication with refresh token fails', async () => {
            const data = {
                refresh_token: 'refresh_token_example'
            };

            cognitoIdentityServiceProvider.initiateAuth.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await AuthService.refreshToken(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 403, 
                    message: 'Error trying to refresh the tokens'
                });
            }
        });

        it('SUCCESS: Token is refreshed successfully', async () => {
            const data = {
                refresh_token: 'refresh_token_example'
            };

            const expectedResponse = {
                testAtt: 'test'
            };

            cognitoIdentityServiceProvider.initiateAuth.mockImplementation(async (_, cb) => cb(false, expectedResponse));

            try {
                const res = await AuthService.refreshToken(data);
                expect(res).toEqual(expectedResponse);
            } catch(err) {
                
            }
        });
    });
});