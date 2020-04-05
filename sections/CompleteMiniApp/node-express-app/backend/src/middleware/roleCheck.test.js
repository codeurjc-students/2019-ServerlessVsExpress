const UserModel = require('../models/user');
const roleCheck = require('../middleware/roleCheck');
const mocks = require('node-mocks-http');
const { verify, sign } = require('jsonwebtoken');
const app = require('../server');
const { findOne } = require('../models/user');

// Mocks

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));

describe("Role Check tests", () => {
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
        server.close();
        done();
    });

    it("ERROR 404: User has not been found", async () => {
        res.locals = {
            email: 'test@test.com'
        };

        const next = jest.fn();
        const spyFindOne = jest.spyOn(UserModel, 'findOne');
        spyFindOne.mockImplementation((_, cb) => cb(true, {}));

        roleCheck(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._getData().message).toBe("User not found");
    });

    it("ERROR 401: User has been found but hasn't ADMIN role", async () => {
        res.locals = {
            email: 'test@test.com'
        };

        const next = jest.fn();
        const spyFindOne = jest.spyOn(UserModel, 'findOne');
        spyFindOne.mockImplementation((_, cb) => cb(false, {role: 'USER'}));

        roleCheck(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res._getData().message).toBe("Unauthorized operation");
    });

    it("SUCCESS: User has been found and has ADMIN role", async () => {
        res.locals = {
            email: 'test@test.com'
        };

        const next = jest.fn();
        const spyFindOne = jest.spyOn(UserModel, 'findOne');
        spyFindOne.mockImplementation((_, cb) => cb(false, {role: 'ADMIN'}));

        roleCheck(req, res, next);
        expect(next).toHaveBeenCalled();
    });

});
