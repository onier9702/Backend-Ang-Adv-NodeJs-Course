
const mongoose = require('mongoose'); // NPM package to handle connection with mongoDB

const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGO_DB_CNN);
        console.log('DB Online !!');
        
    } catch (error) {
        console.log(error);
        throw new Error('Not connected to DB, check-logs');
    }


};

module.exports = {
    dbConnection
}