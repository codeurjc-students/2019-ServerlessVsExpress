const AuthController = require('./AuthController');
const mocks = require('node-mocks-http');
const { findOne, findOneAndUpdate } = require('../models/user');
const { verify, sign } = require('jsonwebtoken');
const { compare } = require('bcrypt');
const app = require('../server');
const mongoose = require('mongoose');

// Mocks

jest.mock('../models/user', () => ({
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe("AuthController tests", () => {
    let application;
    let server;
    let baseUri;
    let req;
    let res;

    beforeAll(done => {
        done();
    })

    beforeEach((done) => {
        application = app;
        server = application.listen(0, done);
        const port = (server.address()).port;
        baseUri = `http://localhost:${port}`;
        jest.resetAllMocks();
        jest.clearAllMocks();
        req = mocks.createRequest();
        res = mocks.createResponse();
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    afterAll(done => {
        mongoose.connection.close();
        server.close(done);
    })

    describe("Login", () => {
        it("ERROR 400: Email is missing", async () => {
            req.body = {
                email: undefined,
                password: "abc"
            };

            AuthController.login(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("Error, email or password missing");
        });

        it("ERROR 400: Password is missing", async () => {
            req.body = {
                email: "test@test.com",
                password: undefined
            };

            AuthController.login(req, res);
            expect(res._getData().message).toBe("Error, email or password missing");
            expect(res.statusCode).toBe(400);
        });

        it("ERROR 401: Database error happened", async () => {
            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            findOne.mockImplementation((_, cb) => cb(true, {}));

            AuthController.login(req, res);
            expect(res._getData().message).toBe("An error happened while using the database");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: User not found in the database", async () => {
            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            findOne.mockImplementation((_, cb) => cb(false, undefined));

            AuthController.login(req, res);
            expect(res._getData().message).toBe("User doesn't exist");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: User found in the database but error happened using bcrypt comparation", async () => {
            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            findOne.mockImplementation((_, cb) => cb(false, {}));
            compare.mockImplementation((_, __, cb) => cb(true, {}));

            AuthController.login(req, res);
            expect(res._getData().message).toBe("An error happened while using the bcrypt");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: User found in the database but password do not match", async () => {
            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            findOne.mockImplementation((_, cb) => cb(false, {}));
            compare.mockImplementation((_, __, cb) => cb(false, undefined));

            AuthController.login(req, res);
            expect(res._getData().message).toBe("Wrong password");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: User found, password matches but user is not activated", async () => {
            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            const mockedUserDb = {
                activated: "PENDING"
            };

            findOne.mockImplementation((_, cb) => cb(false, mockedUserDb));
            compare.mockImplementation((_, __, cb) => cb(false, {}));

            AuthController.login(req, res);
            expect(res._getData().message).toBe("Password is not verified");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Error updating connected status in the database", async () => {
            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            const mockedUserDb = {
                toObject: jest.fn(),
                activated: "ACTIVE",
                connected: false
            };

            findOne.mockImplementation((_, cb) => cb(false, mockedUserDb));
            compare.mockImplementation((_, __, cb) => cb(false, true));
            findOneAndUpdate.mockImplementation((_, __, cb) => cb(true));

            AuthController.login(req, res);
            expect(res._getData().message).toBe("Error trying to update user's connected attribute in the database");
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 200: Returns email, role, access_token and refresh_token", async () => {
            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            const expectedMatchResponseMessage = {
                email: expect.any(String),
                role: expect.any(String),
                access_token: expect.any(String),
                refresh_token: expect.any(String)
            };

            const mockedUserDb = {
                toObject: jest.fn(),
                activated: "ACTIVE",
                connected: false,
                role: "ADMIN",
                email: "test@test.com"
            };

            findOne.mockImplementation((_, cb) => cb(false, mockedUserDb));
            compare.mockImplementation((_, __, cb) => cb(false, true));
            findOneAndUpdate.mockImplementation((_, __, cb) => cb(false));
            sign.mockImplementation((_, __, ___) => 'token');

            AuthController.login(req, res);
            expect(res._getData()).toEqual({
                email: mockedUserDb.email,
                role: mockedUserDb.role,
                access_token: 'token',
                refresh_token: 'token'
            });
            expect(res.statusCode).toBe(200);
        });
    });

    describe("Refresh token", () => {
        it("ERROR 401: Refresh token does not exist in request headers", async () => {
            req.headers = {
                authorization: undefined
            };
            
            AuthController.refreshToken(req, res);
            expect(res._getData().message).toBe("Unauthorized operation. Refresh token is missing.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Refresh token has a bad format or does not exist", async () => {
            req.headers = {
                authorization: 'badformat'
            };
            
            AuthController.refreshToken(req, res);
            expect(res._getData().message).toBe("Unauthorized operation. You must login.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Refresh token is not valid", async () => {
            const refresh_token = 'f23fd48c-45b6-4755-a527-68d161cd8b87';

            req.headers = {
                authorization: `Bearer ${refresh_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(true, {}));
            
            AuthController.refreshToken(req, res);
            expect(res._getData().message).toBe("Invalid refresh token.");
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 201: Token is refreshed", async () => {
            const refresh_token = 'f23fd48c-45b6-4755-a527-68d161cd8b87';
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${refresh_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            sign.mockImplementation(() => access_token);
            
            AuthController.refreshToken(req, res);
            expect(res._getData().access_token).toBe(access_token);
            expect(res.statusCode).toBe(201);
        });
    });

    describe("Check valid token", () => {
        it("ERROR 401: Token does not exist in authorization headers", async () => {
            req.headers = {
                authorization: undefined
            };
            
            AuthController.checkValidToken(req, res);
            expect(res._getData().message).toBe("Unauthorized operation.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token has a bad format", async () => {
            req.headers = {
                authorization: 'badaccesstoken'
            };
            
            AuthController.checkValidToken(req, res);
            expect(res._getData().message).toBe("Unauthorized operation.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token is not valid", async () => {
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(true, {}));
            
            AuthController.checkValidToken(req, res);
            expect(res._getData().message).toBe("Invalid access token.");
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 201: Access token is valid", async () => {
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((access_token, __, cb) => cb(false, {}));
            
            AuthController.checkValidToken(req, res);
            expect(res._getData().access_token).toBe(access_token);
            expect(res.statusCode).toBe(201);
        });
    });

    describe("Logout", () => {
        it("ERROR 401: Token does not exist in authorization headers", async () => {
            req.headers = {
                authorization: undefined
            };
            
            AuthController.logout(req, res);
            expect(res._getData().message).toBe("Unauthorized operation.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token has a bad format", async () => {
            req.headers = {
                authorization: 'badaccesstoken'
            };
            
            AuthController.logout(req, res);
            expect(res._getData().message).toBe("Unauthorized operation.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token is not valid", async () => {
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(true, {}));
            
            AuthController.logout(req, res);
            expect(res._getData().message).toBe("Invalid access token.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Error finding user by email in the database", async () => {
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            findOne.mockImplementation((_, cb) => cb(true, {}));
            
            AuthController.logout(req, res);
            expect(res._getData().message).toBe("Error from database while trying to find the user.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Email not found in database", async () => {
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            findOne.mockImplementation((_, cb) => cb(false, undefined));
            
            AuthController.logout(req, res);
            expect(res._getData().message).toBe("User doesn't exist.");
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Email was found but an error happened updating connected attribute", async () => {
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            const mockedUser = {
                toObject: () => jest.fn()
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            findOne.mockImplementation((_, cb) => cb(false, mockedUser));
            findOneAndUpdate.mockImplementation((_, __, cb) => cb(true));
            
            AuthController.logout(req, res);
            expect(res._getData().message).toBe("Error from database when trying to update user's connected attribute.");
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 204: User logged out successfully", async () => {
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            const mockedUser = {
                toObject: () => jest.fn()
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            findOne.mockImplementation((_, cb) => cb(false, mockedUser));
            findOneAndUpdate.mockImplementation((_, __, cb) => cb(false));
            
            AuthController.logout(req, res);
            expect(res._getData()).toBe("");
            expect(res.statusCode).toBe(204);
        });
    });
});