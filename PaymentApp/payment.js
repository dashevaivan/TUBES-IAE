const express = require('express');
const amqp = require('amqplib');
const app = express();


// Array to store selected menus based on received IDs
const menus = [];

// Function to consume messages from RabbitMQ
async function consumeMenuChoice() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'menu_choices';

    await channel.assertQueue(queue, { durable: false });
    console.log("Menunggu pesan di %s.", queue);

    // Consume messages from the queue
    channel.consume(queue, (msg) => {
        const message = msg.content.toString();
        const selectedMenu = JSON.parse(message);
        const selectedmenu = JSON.parse(selectedMenu);
        console.log(selectedmenu);
        menus.push(selectedmenu)
    }, { noAck: true });
};


consumeMenuChoice();
app.get('/payment', (req, res) => {
    // Call function to consume messages when request to confirm payment is made
    res.json(menus)
});

app.listen(5002, () => {
    console.log("Connected, Port : 5002")
});
