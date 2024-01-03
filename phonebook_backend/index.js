require('dotenv').config()  // Use for environment variables
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Create a custom morgan token
morgan.token('body', (req) => JSON.stringify(req.body))

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
        console.log('🚀 ~ file: index.js:26 ~ app.get ~ count:', count)
        response.send(`<p> The Phonebook currently contains ${count} contacts </p> <p> ${new Date()} </p>`)
    })
    .catch(error => {
        console.error('Error counting documents', error)
        response.status(500).send('Internal Server Error')
    })
})

// Read routes
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).send('Person does not exist')
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    console.log('body:', request.body)

    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'person must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Delete routes
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Update route
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// Unknown endpoints middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handling middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

// Running the application
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})