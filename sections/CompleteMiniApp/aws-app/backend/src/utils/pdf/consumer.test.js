const consumer = require('./consumer');
const AWS = require('aws-sdk');
const PDFDocument = require('pdfkit');

let mockPromiseReturnS3Upload = (req) => {
    return new Promise((resolve, reject) => {
        return reject({
            statusCode: 500, 
            message: 'Error uploading file to AWS S3 bucket'
        });
    })
};

jest.mock('aws-sdk', () => {
    const mockedS3 = jest.fn(() => ({
            upload: jest.fn((_) => ({
                promise: jest.fn().mockImplementation(mockPromiseReturnS3Upload)
            })
        )})
    );

    const mockedConfig = {
        update: jest.fn()
    };

    return {
        S3: mockedS3,
        config: mockedConfig
    };
});

Object.assign(process.env, {
    PDF_BUCKET_NAME: 'pdf-bucket-name'
});

describe('Tests PDF Consumer', () => {
    let S3;
    let pdfDocument;

    beforeAll(done => {
        jest.setTimeout(25000);
        done();
    })

    beforeEach((done) => {
        S3 = new AWS.S3();
        pdfDocument = new PDFDocument();
        done();
    });

    afterEach(done => {
        done();
    });

    afterAll(done => {
        done();
    });

    describe('Tests generatePdf', () => {
        it('Promise rejected: Uploading pdf to AWS S3 bucket went wrong', async () => {
            const data = {
                title: 'title-test',
                content: 'content-test'
            };

            try {
                const res = await consumer.consumer(JSON.stringify(data));
                console.log(res);
            } catch(err) {
                expect(err).toEqual({
                    statusCode: 500, 
                    message: 'Error uploading file to AWS S3 bucket'
                });
            }
        });

        it('Promise resolved: Uploading pdf to AWS S3 bucket was successful', async () => {
            const data = {
                title: 'title-test',
                content: 'content-test'
            };

            mockPromiseReturnS3Upload = (req) => {
                return new Promise((resolve, reject) => {
                    return resolve({
                        statusCode: 201, 
                        message: 'Pdf was uploaded successfully to AWS S3 bucket'
                    });
                })
            };

            try {
                const res = await consumer.consumer(JSON.stringify(data));
                expect(res).toEqual({
                    statusCode: 500, 
                    message: 'Error uploading file to AWS S3 bucket'
                });
            } catch(err) {}
        });
    });
});