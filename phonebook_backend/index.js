require('dotenv').config()  // Use for environment variables
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Create a custom morgan token
morgan.token('body', (req, res) => JSON.stringify(req.body))

// Allow cross origin resource sharing
app.use(cors())
// Make sure to fetch the static page
app.use(express.static('dist'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Initialise persons to be empty
let persons = []

// Information routes
app.get('/info', (request, response) => {
    Person.countDocuments({})
    .then(count => {
        console.log("🚀 ~ file: index.js:26 ~ app.get ~ count:", count)
        response.send(`<p> The Phonebook currently contains ${count} contacts </p> <p> ${new Date()} </p>`)
    })
    .catch(error => {
        console.error("Error counting documents", error)
        response.status(500).send('Internal Server Error')
    })
})

// Read routes
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log('body:', request.body)

    if (!body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'person must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Delete routes (DOESN'T WORK WITH MONGO YET)
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

// Running the application
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})