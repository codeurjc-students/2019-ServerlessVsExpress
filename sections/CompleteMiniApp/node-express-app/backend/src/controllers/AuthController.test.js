const AuthController = require('./AuthController');
const mocks = require('node-mocks-http');
const { findOne, findOneAndUpdate } = require('../models/user');
const { verify, sign } = require('jsonwebtoken');
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

describe("AuthController tests", () => {
    let application;
    let server;
    let baseUri;

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
        it("ERROR 400: Email is missing", async (done) => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.body = {
                email: undefined,
                password: "abc"
            };

            AuthController.login(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(400);
            done();
        });

        it("ERROR 400: Password is missing", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.body = {
                email: "test@test.com",
                password: undefined
            };

            AuthController.login(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(400);
        });

        it("ERROR 401: Database error", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            const mockedResponse = res.status(401);

            findOne.mockImplementation((_, cb) => cb(true, {}));

            AuthController.login(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 200: Returns email, role, access_token and refresh_token", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.body = {
                email: "test@test.com",
                password: "1234"
            };

            const mockedResponse = res.send({
                email: req.body.email,
                role: 'USER',
                access_token: 'access_token',
                refresh_token: 'refresh_token'
            });

            findOne.mockImplementation((_, cb) => cb(false, {}));

            AuthController.login(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(200);
        });
    });

    describe("Refresh token", () => {
        it("ERROR 401: Refresh token does not exist in request headers", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.headers = {
                authorization: undefined
            };
            
            AuthController.refreshToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Refresh token has a bad format", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.headers = {
                authorization: 'badformat'
            };
            
            AuthController.refreshToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Refresh token is not valid", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            const refresh_token = 'f23fd48c-45b6-4755-a527-68d161cd8b87';

            req.headers = {
                authorization: `Bearer ${refresh_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(true, {}));
            
            AuthController.refreshToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 201: Token is refreshed", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            const refresh_token = 'f23fd48c-45b6-4755-a527-68d161cd8b87';
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${refresh_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            sign.mockImplementation(() => access_token);
            
            AuthController.refreshToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(201);
        });
    });

    describe("Check valid token", () => {
        it("ERROR 401: Token does not exist in authorization headers", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.headers = {
                authorization: undefined
            };
            
            AuthController.checkValidToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token has a bad format", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.headers = {
                authorization: 'badaccesstoken'
            };
            
            AuthController.checkValidToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token is not valid", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(true, {}));
            
            AuthController.checkValidToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 201: Access token is valid", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            
            AuthController.checkValidToken(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(201);
        });
    });

    describe("Logout", () => {
        it("ERROR 401: Token does not exist in authorization headers", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.headers = {
                authorization: undefined
            };
            
            AuthController.logout(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token has a bad format", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();

            req.headers = {
                authorization: 'badaccesstoken'
            };
            
            AuthController.logout(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Access token is not valid", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(true, {}));
            
            AuthController.logout(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Error finding user by email in the database", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            findOne.mockImplementation((_, cb) => cb(true, {}));
            
            AuthController.logout(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Email not found in database", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            const access_token = '65b7e6e3-68c2-41c8-9fc1-99390b48cddc';

            req.headers = {
                authorization: `Bearer ${access_token}`
            };

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            findOne.mockImplementation((_, cb) => cb(false, undefined));
            
            AuthController.logout(req, res);
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("ERROR 401: Email was found but an error happened updating connected attribute", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
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
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(401);
        });

        it("SUCCESS 204: User logged out successfully", async () => {
            const req = mocks.createRequest();
            const res = mocks.createResponse();
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
            expect(res).not.toBe(null);
            expect(res.statusCode).toBe(204);
        });
    });
});