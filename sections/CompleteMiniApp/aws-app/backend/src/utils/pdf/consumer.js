const AWS = require('aws-sdk');
// const { pdfBucketName } = require('./config/config');
const PDFDocument = require('pdfkit');

// Set the region
// AWS.config.update({region: 'eu-west-3'});

// Configure S3 object to use the API functionality of 2006-03-01 version
const S3 = new AWS.S3({apiVersion: '2006-03-01'});

const consumer = async (data) => {
    data = JSON.parse(data);
    return await generatePdf(data);
};

const generatePdf = (data) => {
    // Creating the pdf document with the data received in the message's body
    const pdfContent = new PDFDocument();
    pdfContent.fontSize(14);
    pdfContent.text(`${data.title}`);
    pdfContent.moveDown();
    pdfContent.fontSize(11);
    pdfContent.text(`${data.content}`);
    pdfContent.end();

    const params = {
        Key : `pdfs/pdf-${Date.now()}.pdf`,
        Body : pdfContent,
        Bucket : process.env.PDF_BUCKET_NAME
    };

    //console.log(`Uploading pdf with name: ${params.Key}`);
    return S3.upload(params).promise();
};

module.exports = {
    consumer
};