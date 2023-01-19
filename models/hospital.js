

const { Schema, model } = require('mongoose');


const HospitalSchema = Schema({

    name: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // doctor: {
    //     required: true,
    //     type: Schema.Types.ObjectId,
    //     ref: 'Doctor'
    // },

});

HospitalSchema.method('toJSON', function () {

    const { __v, _id, ...rest } = this.toObject();
    return {
        id: _id,
        ...rest
    }

})

module.exports = model('Hospital', HospitalSchema);

