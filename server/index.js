require('dotenv').config();
// const {connect} = require('./src/services/mongoose');
const express = require('express');
const app = express();
const eventsRouter = require('./routes/events');

const port = process.env.PORT || 3000;

connect().catch(err=>console.log(err));

app.use(express.json());

app.use(eventsRouter);

app.listen(port,() => {
    console.log(`Le serveur est lance a : http://localhost:${port}`);
})