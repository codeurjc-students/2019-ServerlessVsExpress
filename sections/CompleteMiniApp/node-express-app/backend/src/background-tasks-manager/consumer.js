const pdfCreator = require('html-pdf');
const fs = require('fs');

const consumer = (conn) => {
    const queue = 'pdfQueue';
    conn.createChannel((err, channel) => {
        if(err) {
            console.error(err);
            process.exit(1);
        }
        channel.assertQueue(queue, { durable: true }); // Durable: true makes the queue to persist even if connection has been closed
        channel.consume(queue, async (pdfData) => {
            try {
                let pdf = JSON.parse(pdfData.content.toString());
                let pdfGenerated = await generatePdf(pdf);
                if(pdfGenerated.error) {
                    console.log(pdfGenerated.error); 
                } else {
                    console.log(`The pdf has been generated in: ${pdfGenerated.response.filename}`);  
                }
                // Send back the ack to let it know that the bg task was completed
                channel.ack(pdfData);
            } catch(err) {
                console.log({error: err});
            }
             
        }, { noAck: false }); // This tells the server to not delete the message once it's delivered
    });
};

const generatePdf = (data) => {
    if(!data.title || !data.users) {
        return {error: `You must provide a title and an array of users in the body's request`};
    }

    const users = data.users.map(user => `<li>${user.email}</li>`);

    const content = `
    <h1>${data.title}</h1>
    <ul>
    ${users}
    </ul>
    `;

    return new Promise((resolve, reject) => {
        pdfCreator.create(content).toFile(`./pdfs/generated-${Date.now()}.pdf`, (err, res) => {
            if(err) {
                reject({error: err});
            } else {
                resolve({error: null, response: res});
            }
        });
    });
};

module.exports = {
    consumer
};