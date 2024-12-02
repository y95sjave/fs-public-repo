const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(morgan('tiny'))
//app.use(morgan(':method :url :body'))
app.use(cors())

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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const randomId = (99999999*Math.random()).toFixed(0)
  return String(randomId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name already exists, must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)

  morgan.token('body', request => JSON.stringify(request.body))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})