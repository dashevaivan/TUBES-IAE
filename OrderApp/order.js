const express = require('express');
const amqp = require('amqplib');
const app = express();
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to connect to RabbitMQ and publish message
async function publishMenuChoice(menuId) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'menu_choices';

    await channel.assertQueue(queue, { durable: false });
    
    // Publish menu choice to the message broker
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(menuId)));

    console.log("%s", menuId);
    
    setTimeout(() => {
        connection.close();
    }, 500);
}


app.post('/order/:id', async (req, res) => {
    const { data, error } = await supabase
    .from('menu')
    .select()
    .eq("id", req.params.id)

    if(data){
        publishMenuChoice(JSON.stringify(data))
        res.json(data)
    }else{
        res.status(404).json({error : "Data not found"})
    }
});

app.listen(5001, () => {
    console.log("Connected, Port : 5001");
});
