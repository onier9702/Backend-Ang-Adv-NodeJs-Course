
const express = require('express');
const cors = require('cors')
const { dbConnection } = require('./db/config');
require('dotenv').config()

 

// create express server
const app = express();

// configuring cors
app.use(cors())

// read and parsed of Body
app.use( express.json() );

// Database connection
dbConnection();

// routes
app.use( '/api/users', require('./routes/route_user') );
app.use( '/api/login', require('./routes/route_auth') );
app.use( '/api/hospital', require('./routes/route_hospital') );
app.use( '/api/doctors', require('./routes/route_doctor') );
app.use( '/api/all', require('./routes/route_search') );
app.use( '/api/upload', require('./routes/route_upload') );


app.listen( process.env.PORT, () => {
    console.log(`App running on port:${process.env.PORT}`);
} )
