
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
    age: {
        type: Number,
        required: false
    },
    img: {
        type: String
    },
    role: {
        type: Array,
        default: ['USER_ROLE']
    },
    google: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
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

