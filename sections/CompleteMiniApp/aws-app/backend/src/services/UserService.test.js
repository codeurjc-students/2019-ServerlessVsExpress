const UserService = require('./UserService');
const AWS = require('aws-sdk');

let mockPromiseReturnDynamoDBPut = (req) => {
    return new Promise((resolve, reject) => {
        return reject(new Error('test'));
    })
};

jest.mock('aws-sdk', () => {
    const mockedCognitoIdentityServiceProvider = {
        getUser: jest.fn(),
        listUsers: jest.fn(),
        adminEnableUser: jest.fn(),
        adminDisableUser: jest.fn()
    };

    const mockedDynamoDB = {
        DocumentClient: jest.fn(() => ({
            put: jest.fn((_) => ({
                promise: jest.fn().mockImplementation(mockPromiseReturnDynamoDBPut)
            })
        )})
    )};

    const mockedConfig = {
        update: jest.fn()
    };
    return {
        CognitoIdentityServiceProvider: jest.fn(() => mockedCognitoIdentityServiceProvider),
        DynamoDB: mockedDynamoDB,
        config: mockedConfig
    };
});

Object.assign(process.env, {
    COGNITO_USER_POOL_CLIENT_ID: 'userpoolclientid',
    COGNITO_DEFAULT_USER_GROUP_NAME: 'usergroupname',
    COGNITO_USER_POOL_ID: 'userpoolid'
});

describe('Tests UserService', () => {

    let cognitoIdentityServiceProvider;
    let docClient;

    beforeAll(done => {
        jest.setTimeout(25000);
        done();
    })

    beforeEach((done) => {
        cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
        docClient = new AWS.DynamoDB.DocumentClient();
        done();
    });

    afterEach(done => {
        done();
    });

    afterAll(done => {
        done();
    });

    describe('Tests getUserInfo', () => {
        it('ERROR 401: Access Token is missing', async () => {
            const data = {};

            try {
                const res = await UserService.getUserInfo(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 401, 
                    message: 'You must provide an access_token'
                });
            }
        });

        it('ERROR 400: Getting the user fails', async () => {
            const data = {
                access_token: 'access_token_example'
            };

            cognitoIdentityServiceProvider.getUser.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await UserService.getUserInfo(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400, 
                    message: 'Error finding user'
                });
            }
        });

        it('SUCCESS: Gets the user successfully', async () => {
            const data = {
                access_token: 'access_token_example'
            };

            const exampleResponse = {
                exampleAttr: 'example'
            };

            cognitoIdentityServiceProvider.getUser.mockImplementation(async (_, cb) => cb(false, exampleResponse));

            try {
                const res = await UserService.getUserInfo(data);
                expect(res).toEqual(exampleResponse);
            } catch(err) {
                
            }
        });
    });

    describe('Tests getAllUsers', () => {
        it('ERROR 400: Getting all the users fails', async () => {

            cognitoIdentityServiceProvider.listUsers.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await UserService.getAllUsers();
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400, 
                    message: 'Error getting all the users'
                });
            }
        });

        it('SUCCESS: Getting all the users successfully', async () => {

            const expectedResponse = {
                users: [
                    {
                        username: 'username1'
                    },
                    {
                        username: 'username2'
                    }
                ]
            };

            cognitoIdentityServiceProvider.listUsers.mockImplementation(async (_, cb) => cb(false, expectedResponse));

            try {
                const res = await UserService.getAllUsers();
                expect(res).toEqual(expectedResponse);
            } catch(err) {
                
            }
        });
    });

    describe('Tests activateUserFromAdmin', () => {
        it('ERROR 400: Error enabling user', async () => {
            const data = {
                username: 'username_example',
                activate: true
            };

            cognitoIdentityServiceProvider.adminEnableUser.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await UserService.activateUserFromAdmin(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400, 
                    message: 'Error enabling user'
                });
            }
        });

        it('ERROR 400: Error disabling user', async () => {
            const data = {
                username: 'username_example',
                activate: false
            };

            cognitoIdentityServiceProvider.adminDisableUser.mockImplementation(async (_, cb) => cb(true, {}));

            try {
                const res = await UserService.activateUserFromAdmin(data);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 400, 
                    message: 'Error disabling user'
                });
            }
        });

        it('Success: Enable user successfully', async () => {
            const data = {
                username: 'username_example',
                activate: true
            };

            const expectedResponse = {
                exampleAttr: 'example'
            };

            cognitoIdentityServiceProvider.adminEnableUser.mockImplementation(async (_, cb) => cb(false, expectedResponse));

            try {
                const res = await UserService.activateUserFromAdmin(data);
                expect(res).toEqual(expectedResponse);
            } catch(err) {
                
            }
        });

        it('Success: Disable user successfully', async () => {
            const data = {
                username: 'username_example',
                activate: false
            };

            const expectedResponse = {
                exampleAttr: 'example'
            };

            cognitoIdentityServiceProvider.adminDisableUser.mockImplementation(async (_, cb) => cb(false, expectedResponse));

            try {
                const res = await UserService.activateUserFromAdmin(data);
                expect(res).toEqual(expectedResponse);
            } catch(err) {
                
            }
        });
    });

    describe('Tests addConnectionInfo', () => {

        it('Promise rejected: Error adding connection info', async () => {
            const event = {
                body: JSON.stringify({
                    email: 'test@test.com'
                }),
                headers: {
                    'User-Agent': 'example_user_agent',
                    'Accept-Language': 'example_accept_language'  
                }
            };

            const expectedRejectedValue = {
                error: 'Error trying to write in the database'
            };

            mockPromiseReturnDynamoDBPut = (req) => {
                return new Promise((resolve, reject) => {
                    return reject(expectedRejectedValue)
                })
            };
            
            const res = UserService.addConnectionInfo(event);
            return expect(res).rejects.toEqual(expectedRejectedValue);
        });

        it('Promise resolved: Connection information added successfully', async () => {
            const event = {
                body: JSON.stringify({
                    email: 'test@test.com'
                }),
                headers: {
                    'User-Agent': 'example_user_agent',
                    'Accept-Language': 'example_accept_language'  
                }
            };

            const expectedResolvedValue = {
                message: 'Connection information was added successfully'
            };

            mockPromiseReturnDynamoDBPut = (req) => {
                return new Promise((resolve, reject) => {
                    return resolve(expectedResolvedValue)
                })
            };

            const res = UserService.addConnectionInfo(event);
            return expect(res).resolves.toEqual(expectedResolvedValue);
        });
    });
});