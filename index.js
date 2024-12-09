require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

mongoose.set('strictQuery', false)

app.use(express.json())
app.use(morgan('tiny'))
//app.use(morgan(':method :url :body'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1"
  },
  {
    name: "Ada Lovelace",
    number: "23423423",
    id: "2"
  },
  {
    name: "Dan Abramov",
    number: "99",
    id: "3"
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4"
  },
]


app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people<br/><br/>${Date()}`)
})

app.get('/api/persons', (request, response) => {
  console.log("index.js app.get")
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  //const person = persons.find(person => person.id === id)
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log("index.js app.put")
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person)
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const generateId = () => {
  const randomId = (99999999*Math.random()).toFixed(0)
  return String(randomId)
}

app.post('/api/persons', (request, response, next) => {
  console.log("index.js app.post")
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  /*if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name already exists, must be unique'
    })
  }*/

  const person = new Person({
  //  id: generateId(),
    name: body.name,
    number: body.number
  })

  /*persons = persons.concat(person)
  response.json(person)
 */
  console.log("index.js doing person.save")
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
  //morgan.token('body', request => JSON.stringify(request.body))
})

app.delete('/api/persons/:id', (request, response, next) => {
  /*const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()*/

  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error("ERROR:",error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})