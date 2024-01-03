const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// Create a custom morgan token
morgan.token('body', (req, res) => JSON.stringify(req.body))

// Allow cross origin resource sharing
app.use(cors())
// Make sure to fetch the static page
app.use(express.static('dist'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
// Information routes
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people </p> <p> ${new Date()}</>`)
})

// Read routes
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log("🚀 ~ file: index.js:39 ~ app.get ~ id:", id)
    
    const person = persons.find(p => p.id === id)
    console.log("🚀 ~ file: index.js:42 ~ app.get ~ person:", person)

    if (person){
        response.json(person)
    } else {
        response.send(404, "Person not found")
    }
})

// Create routes
const generateId = () => {
    let generatedId = 0
    let exists = true

    while (exists){
        generatedId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

        // Check if the generated Id already exists in persons
        if (!persons.some(p => p.id === generatedId)){
            exists = false
        }
    }
    console.log("Generated the following ID: ", generatedId)
    return generatedId
}

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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    console.log('person successfully added to the list')

    response.json(person)
})

// Delete routes
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

// Running the application
const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})