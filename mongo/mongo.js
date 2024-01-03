const mongoose = require('mongoose');
const readline = require('readline');

// Define a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Get the password, name, and number from the command line
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

// Define the URL
const url = `mongodb+srv://fullstack:${password}@cluster0.ue4jccp.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
})

// Function to display users and close the application
const displayUsersAndClose = () => {
    console.log("phonebook: ")
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        rl.close()
    })
}

if (process.argv.length < 5) {
    console.log('give password, name, and number as arguments to add user');
    rl.question('Do you want to display the users in the database (y/n)', (answer) => {
        if (answer.toLowerCase() === 'y') {
            displayUsersAndClose()
        } else {
            // If the user doesn't want to see contacts, close the application
            mongoose.connection.close()
            rl.close()
        }
    })
} else {
    // Save the contact and close the application
    person.save().then((result) => {
    console.log('contact saved!')
    mongoose.connection.close()
    rl.close()
  })
}
