const UserController = require('./UserController');
const mocks = require('node-mocks-http');
const { findOne, findOneAndUpdate, find, save } = require('../models/user');
const UserModel = require('../models/user');
const { verify, sign } = require('jsonwebtoken');
const app = require('../server');
const { createTransport } = require('nodemailer');
const { connect } = require('amqplib/callback_api');

// Mocks

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(),
}));

jest.mock('amqplib/callback_api', () => ({
    connect: jest.fn(),
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
        //mongoose.connection.close();
        server.close();
        done();
    });

    describe("Get all the users", () => {
        it("ERROR 401: Database error when trying to fetch all the users", async () => {
            const spyFind = jest.spyOn(UserModel, 'find');
            spyFind.mockImplementation((_, __, cb) => cb(true, []));

            UserController.getAllUsers(req, res);
            expect(res.statusCode).toBe(401);
            expect(res._getData().message).toBe("Database error when trying to fetch all the users");
        });

        it("SUCCESS 200: All the users from the database are returned", async () => {
            const users = [
                {
                    email: 'user1@gmail.com'
                },
                {
                    email: 'user2@gmail.com'
                }
            ];

            const spyFind = jest.spyOn(UserModel, 'find');
            spyFind.mockImplementation((_, __, cb) => cb(false, users));

            UserController.getAllUsers(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getData()).toEqual(users);
        });
    });

    describe("Get all admins", () => {
        it("ERROR 401: Database error when trying to fetch all the admins", async () => {
            const spyFind = jest.spyOn(UserModel, 'find');
            spyFind.mockImplementation((_, __, cb) => cb(true, []));

            UserController.getAdmins(req, res);
            expect(res.statusCode).toBe(401);
            expect(res._getData().message).toBe("Database error when trying to fetch all the admins");
        });

        it("SUCCESS 200: All the admins from the database are returned", async () => {
            const admins = [
                {
                    email: 'admin1@gmail.com'
                },
                {
                    email: 'admin2@gmail.com'
                }
            ];

            const spyFind = jest.spyOn(UserModel, 'find');
            spyFind.mockImplementation((_, __, cb) => cb(false, admins));

            UserController.getAdmins(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getData()).toEqual(admins);
        });
    });

    describe("Register", () => {
        it("ERROR 400: Body parameters are missing", async () => {
            req.body = undefined;

            UserController.register(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("Body parameters are missing");
        });

        it("ERROR 400: Body parameters are wrong", async () => {
            req.body = {
                email: 'test@test.com',
                wrongParam: 'invented'
            };

            UserController.register(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("Wrong body parameters");
        });

        it("ERROR 400: Database error when trying to save the user", async () => {
            req.body = {
                email: 'test@test.com',
                password: '1234'
            };
            
            const spySave = jest.spyOn(UserModel.prototype, 'save');
            spySave.mockImplementation(cb => cb(true));

            UserController.register(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("Database error when trying to save the user");
        });

        it("ERROR 400: Error sending activation email to user", async () => {
            req.body = {
                email: 'test@test.com',
                password: '1234'
            };
            
            const spySave = jest.spyOn(UserModel.prototype, 'save');
            spySave.mockImplementation(cb => cb(false));
            createTransport.mockReturnValue({
                sendMail: jest.fn().mockImplementation((_, cb) => cb(true, {}))
            });
            

            UserController.register(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("Error sending activation email");
        });

        it("SUCCESS 201: User registers successfully", async () => {
            req.body = {
                email: 'test@test.com',
                password: '1234'
            };
            
            const spySave = jest.spyOn(UserModel.prototype, 'save');
            spySave.mockImplementation(cb => cb(false));
            createTransport.mockReturnValue({
                sendMail: jest.fn().mockImplementation((_, cb) => cb(false, {}))
            });
            

            UserController.register(req, res);
            expect(res.statusCode).toBe(201);
            expect(res._getData().message).toBe("User created. Check your email inbox to activate your account!");
        });
    });

    describe("Activate", () => {
        it("ERROR 401: Activation token has not been sent in the URL", async () => {
            req.query["activation_token"] = undefined;

            UserController.activate(req, res);
            expect(res.statusCode).toBe(401);
            expect(res._getData().message).toBe("The activation must be sent!");
        });

        it("ERROR 401: Activation token could not be verified", async () => {
            req.query["activation_token"] = "1649592a-1876-4770-998b-62d1ca887d29";

            verify.mockImplementation((_, __, cb) => cb(true, {}));

            UserController.activate(req, res);
            expect(res.statusCode).toBe(401);
            expect(res._getData().message).toBe("Something went wrong during the activation.");
        });

        it("ERROR 400: Database error when trying to activate the user", async () => {
            req.query["activation_token"] = "1649592a-1876-4770-998b-62d1ca887d29";

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            const spyFindOneAndUpdate = jest.spyOn(UserModel, 'findOneAndUpdate');
            spyFindOneAndUpdate.mockImplementation((_, __, cb) => cb(true, {}));

            UserController.activate(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("Database error trying to activate the user");
        });

        it("SUCCESS 200: User is activated successfully", async () => {
            req.query["activation_token"] = "1649592a-1876-4770-998b-62d1ca887d29";

            verify.mockImplementation((_, __, cb) => cb(false, {}));
            const spyFindOneAndUpdate = jest.spyOn(UserModel, 'findOneAndUpdate');
            spyFindOneAndUpdate.mockImplementation((_, __, cb) => cb(false, {}));

            UserController.activate(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getData()).toBe(`Your account has been activated! Click here to go to the login page <a href="http://localhost:3000/login">http://localhost:3000/login</a>`);
        });
    });

    describe("Activate user from Admin", () => {
        it("ERROR 400: Request hasn't got the proper body", async () => {
            req.body = {

            };

            UserController.activateUserFromAdmin(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("The request body must contain an email");
        });

        describe("Account activation from Admin", () => {
            it("ERROR 400: Database error when trying to activate an user from an admin account", async () => {
                req.body = {
                    email: 'test@test.com',
                    activate: true
                };
    
                const spyFindOneAndUpdate = jest.spyOn(UserModel, 'findOneAndUpdate');
                spyFindOneAndUpdate.mockImplementation((_, __, cb) => cb(true, {}));
    
                UserController.activateUserFromAdmin(req, res);
                expect(res.statusCode).toBe(400);
                expect(res._getData().message).toBe("Database error trying to activate user from admin");
            });
    
            it("SUCCESS 200: Account has been successfully activated from an admin", async () => {
                req.body = {
                    email: 'test@test.com',
                    activate: true
                };
    
                const spyFindOneAndUpdate = jest.spyOn(UserModel, 'findOneAndUpdate');
                spyFindOneAndUpdate.mockImplementation((_, __, cb) => cb(false, {}));
    
                UserController.activateUserFromAdmin(req, res);
                expect(res.statusCode).toBe(200);
                expect(res._getData().message).toBe(`The account with email ${req.body.email} has been activated`);
            });
        });

        describe("Account deactivation from Admin", () => {
            it("ERROR 400: Database error when trying to activate an user from an admin account", async () => {
                req.body = {
                    email: 'test@test.com',
                    activate: false
                };
    
                const spyFindOneAndUpdate = jest.spyOn(UserModel, 'findOneAndUpdate');
                spyFindOneAndUpdate.mockImplementation((_, __, cb) => cb(true, {}));
    
                UserController.activateUserFromAdmin(req, res);
                expect(res.statusCode).toBe(400);
                expect(res._getData().message).toBe("Database error trying to deactivate user from admin");
            });
    
            it("SUCCESS 200: Account has been successfully activated from an admin", async () => {
                req.body = {
                    email: 'test@test.com',
                    activate: false
                };
    
                const spyFindOneAndUpdate = jest.spyOn(UserModel, 'findOneAndUpdate');
                spyFindOneAndUpdate.mockImplementation((_, __, cb) => cb(false, {}));
    
                UserController.activateUserFromAdmin(req, res);
                expect(res.statusCode).toBe(200);
                expect(res._getData().message).toBe(`The account with email ${req.body.email} has been deactivated`);
            });
        });

    });

    describe("Generate Users Pdf", () => {
        it("ERROR 400: The request body does not contain pdf data", async () => {
            req.body = {
                
            };

            UserController.generateUsersPdf(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData().message).toBe("pdfData is missing...");
        });

        it("SUCCESS 201: The pdf has been successfully generated", async () => {
            req.body = {
                pdfData: 'testData'
            };

            UserController.generateUsersPdf(req, res);
            expect(res.statusCode).toBe(201);
            expect(res._getData().message).toBe("Your pdf has been generated!");
        });
    });
});