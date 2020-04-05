const jwtCheck = require('../middleware/jwtCheck');
const mocks = require('node-mocks-http');
const { verify, sign } = require('jsonwebtoken');
const app = require('../server');

// Mocks

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));

describe("JWT Check tests", () => {
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

    it("ERROR 401: Authorization header with Bearer token does not exist", async () => {
        req.headers = {
            authorization: undefined
        };
        const next = jest.fn();

        jwtCheck(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res._getData().message).toBe("Unauthorized operation");
    });

    it("ERROR 401: There is not a proper access token", async () => {
        req.headers = {
            authorization: "Wrongtoken"
        };

        const next = jest.fn();

        jwtCheck(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res._getData().message).toBe("Unauthorized operation");
    });

    it("ERROR 401: The access token is not valid", async () => {
        req.headers = {
            authorization: "Bearer 1649592a-1876-4770-998b-62d1ca887d29"
        };

        const next = jest.fn();
        verify.mockImplementation((_, __, cb) => cb(true, {}));

        jwtCheck(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res._getData().message).toBe("The access token is invalid");
    });

    it("SUCCESS: The access token is valid and the middleware allow the access (next function is called)", async () => {
        req.headers = {
            authorization: "Bearer 1649592a-1876-4770-998b-62d1ca887d29"
        };

        const next = jest.fn();
        verify.mockImplementation((_, __, cb) => cb(false, {email: 'test@test.com'}));

        jwtCheck(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});