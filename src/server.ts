import { Server } from 'http';
import app from './app.js';
import mongoConnect from './utils/database.js';
import colors from 'colors';










const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || 'http://localhost';

let server:Server;


const mongo_uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
mongoConnect(mongo_uri, ()=>{
    server = app.listen(port, () => {
        console.log(`Server listening on ${base_url}/${port}/api/v1`);
    })
});