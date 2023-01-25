
const { Schema, model } = require('mongoose');


const UserSchema = Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }

});

UserSchema.method('toJSON', function () {

    const { __v, _id, password, ...rest } = this.toObject();
    return {
        uid: _id,
        ...rest
    }

})

module.exports = model('User', UserSchema);

