const pdfCreator = require('html-pdf');

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
    if(!data.title || !data.content) {
        return {error: `You must provide a title and a content in the body's request`};
    }

    const content = `
    <h1>${data.title}</h1>
    <p>${data.content}</p>
    `;

    return new Promise((resolve, reject) => {
        pdfCreator.create(content).toFile(`./generated-${Date.now()}.pdf`, (err, res) => {
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