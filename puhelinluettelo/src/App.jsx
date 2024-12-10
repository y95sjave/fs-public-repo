/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import personService from './services/persons'

let notificationError = false

const Notification = ({ message, notificationError=false}) => {
  if (message === null) {
    notificationError = false
    return null
  }

  if (notificationError) {
    console.log("error!")
    return (
      <div className="notification error">
        {message}
      </div>
    )
  }
  else {
    return (
      <div className="notification">
        {message}
      </div>
    )
  }
}

const Filter = (props) => {
  return (
    <>
      <div>Filter names with <input value={App.filter}
          onChange={props.handleFilterChange}/>
      </div><br/>
    </>)
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>name: <input value={App.newName}
        onChange={props.handleNameChange}/>
      </div>
      <div>number: <input value={App.newNumber}
        onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = (props) => {
  const filtered = props.name.toLowerCase().includes(props.filter.toLowerCase())
  if (filtered) {
    return (
      <div>{props.name} {props.number} <button onClick={props.deletePerson}>del</button></div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons.data)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const name = event.target[0].value
    const number = event.target[1].value
    const addedOrUpdatedPerson = {name, number}
    let result = null
  
    // eslint-disable-next-line no-cond-assign
    if (result = persons.find((person) => person.name === name)) {
      if (window.confirm(`${name} is already added to phonebook, replace old number with new one?`)) {
        personService
          .update(result.id, addedOrUpdatedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== result.id ? p : response.data))
            setNotification(`${name} is updated`)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
          })
          .catch(error => {
            setNotification(error.response.data.error, notificationError=true)
                setTimeout(() => {
                  setNotification(null)
                }, 3000)
          }) 
        }
    }
    else {
      personService
        .create(addedOrUpdatedPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNotification(`${name} is added`)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
        })
        .catch(error => {
          console.log("UI catch error", error)
          setNotification(error.response.data.error, notificationError=true)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Really delete ${name}?`)) {
      personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setNotification(`${name} is deleted`)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
      })
      .catch(error => {
        setNotification(error.response.data.error, notificationError=true)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
      }) 
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} notificationError={notificationError}/>
      <Filter handleFilterChange={handleFilterChange}/>
      <h3>Add new</h3><PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h3>Persons</h3>
      {persons.map(person => {
        return (
          <Person key={person.id} name={person.name} number={person.number} filter={filter} deletePerson={() => deletePerson(person.id, person.name)}/>
        )}
      )}
    </div>
  )

}

export default App
