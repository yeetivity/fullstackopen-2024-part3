const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })

// Custom validator function for phone number
const phoneNumberValidator = function(value) {
    // Regular expression for validating the phone number
    const phoneNumberRegex = /^(\+\d{1,3}-)?\d{1,3}-\d+$/;
  
    return phoneNumberRegex.test(value);
  };

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\+?\d{2,4}-\d{7,8}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`,
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)