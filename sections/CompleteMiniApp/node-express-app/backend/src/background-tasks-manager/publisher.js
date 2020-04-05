const publisher = (conn, pdfData) => {
    const queue = 'pdfQueue';
    conn.createChannel((err, channel) => {
        if(err) {
            console.error(err);
            process.exit(1);
        }
        channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(pdfData)), {persistent: true});
    });
};

module.exports = {
    publisher
};