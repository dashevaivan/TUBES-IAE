const express = require('express')
const app = express()
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


app.get('/menu', async (req, res) =>{
    const { data, error } = await supabase
    .from('menu')
    .select()
    res.json(data)
})

app.get('/menu/:id', async (req, res) =>{
    const { data, error } = await supabase
    .from('menu')
    .select()
    .eq("id", req.params.id)

    if(data){
        res.json(data)
    }else{
        res.status(404).json({error : "Data not found"})
    }
})

app.listen(5000, () =>{
    console.log("Connected, Port : 5000")
})