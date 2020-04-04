const publisher = require('./publisher');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {

    let mockedSQSSendMessage = jest.fn().mockImplementation((_, cb) => cb(true, {}));

    const mockedSQS = jest.fn(() => ({
        sendMessage: mockedSQSSendMessage
    }));

    const mockedConfig = {
        update: jest.fn()
    };

    return {
        SQS: mockedSQS,
        config: mockedConfig
    };
});

Object.assign(process.env, {
    PDF_QUEUE_URL: 'pdf-queue-url'
});

describe('Tests PDF Publisher', () => {
    let sqs;

    beforeAll(done => {
        jest.setTimeout(25000);
        done();
    })

    beforeEach((done) => {
        sqs = new AWS.SQS();
        done();
    });

    afterEach(done => {
        done();
    });

    afterAll(done => {
        done();
    });

    describe('Tests publisher', () => {
        it('Promise rejected: SQS sendMessage failed', async () => {
            const pdfData = {
                title: 'title-test',
                content: 'content-test'
            };

            const expectedErrorReceived = 'Error sending message to SQS queue';

            sqs.sendMessage.mockImplementation((_, cb) => cb(expectedErrorReceived, {}));

            try {
                const res = await publisher.publisher(pdfData);
            } catch(err) {
                expect(err.message).toEqual(expectedErrorReceived);
            }
        });

        it('Promise resolved: SQS sendMessage failed', async () => {
            const pdfData = {
                title: 'title-test',
                content: 'content-test'
            };

            const expectedResolvedData = {
                exampleAttr: 'example-value'
            };

            sqs.sendMessage.mockImplementation((_, cb) => cb(false, expectedResolvedData));

            try {
                const res = await publisher.publisher(pdfData);
                expect(res).toEqual(expectedResolvedData);
            } catch(err) {}
        });
    });
});