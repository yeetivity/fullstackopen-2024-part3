import { useState, useEffect } from 'react'
import Contacts from './components/Contacts'
import { Header, SubHeader } from './components/Headers'
import Filter from './components/Filter'
import DoubleInputForm from './components/DoubleInputForm'
import Notification from './components/Notification'
import contactService from './services/contacts'
 
const App = () => {
  const appName = 'Phonebook'

  const [contacts, setContacts] = useState(null) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(null)

  // Add Message Style
  const addMessageStyle = {
    backgroundColor: 'lightgreen',
    border: '2px solid darkgreen',
    color: 'black',
    fontStyle: 'italic',
    fontSize: 16,
    padding: '10px',
    margin: '4px'
  }

  // Error Message Style
  const errorMessageStyle = {
    backgroundColor: 'red',
    border: '2px solid darkred',
    color: 'black',
    fontStyle: 'italic',
    fontSize: 16,
    padding: '10px',
    margin: '4px'
  }

  // Event handlers
  const handleNameChange = (event) => setNewName(event.target.value)
  const handlePhoneNumberChange = (event) => setNewPhoneNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)
  const clearNotification = () => setNotificationMessage(null)
  const showAddMessage = (msg) => {
    setNotificationStyle(addMessageStyle)
    setNotificationMessage(msg)
  }
  const showErrorMessage = (msg) => {
    setNotificationStyle(errorMessageStyle)
    setNotificationMessage(msg)
  }

  const resetInputFields = () => {
    setNewName('')  // Reset name value in the input field
    setNewPhoneNumber('')  // Reset phone number value in the input field
  }
  
  const addNewContact = (event) => {
    event.preventDefault()
    // console.log("🚀 ~ file: App.jsx:29 ~ handleNewName ~ event:", event.target.value)

    // Trim the name and number to get rid of leading and trailing spaces
    const name = newName.trim()
    const number = newPhoneNumber.trim()

    // Throw alert if name or phonenumber input is empty and stop further execution
    if (!name || !number) {
      alert('Please fill in a name and phonenumber')
      return
    }

    // Check if a contact with the same name already exists
    const nameExists = contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())

    // Check if a contact with the same phonenumber already exists (ignoring leading and trailing spaces)
    const phoneNumberExists = contacts.some(contact => contact.number === number)

    // Throw alert if phonenumber already exists and stop further execution
    if (phoneNumberExists) {
      alert(`A contact with this phonenumber ("${number}") already exists \n Please check your existing contacts`)
      return
    }

    // Throw alert if name already exists and if the number is different and update the number if the user wants that
    // Stop further execution if updated
    if (nameExists) {
      if (window.confirm(`Contact ${name} already exists \nDo you want to replace the old number with the new one?`)){
        // Get the contact
        const contact = contacts.find(c => c.name === name)
        const changedContact = { ...contact, number: number}

        contactService
          .update(changedContact)
          .then(newContact => {
            // console.log(newContact)
            setContacts(contacts.map(c => c.id !== newContact.id ? c : newContact))
            showAddMessage(`${newContact.name} was updated successfully`)
          })
          .catch(error => {
            console.log(error.response.data.error)
            showErrorMessage(`Something went wrong: ${error.response.data.error}`)
            setContacts(contacts.filter(c => c.id !== changedContact.id))
          })
        
        resetInputFields()
        return
      }
    }

    // Create a new contact object with the trimmed name, the phone number, and a unique id
    const contactObject = { name, number}

    // Send the created object to the server
    contactService
      .create(contactObject)
      .then(returnedContact => {
        setContacts(contacts.concat(returnedContact))
        showAddMessage(`${contactObject.name} was added to the contacts successfully`)
      })
      .catch(error => {
        console.log(error.response.data.error)
        showErrorMessage(`Something went wrong: ${error.response.data.error}`)
      })

    resetInputFields()
  }

  const deleteContact = (contact) => {
    console.log("delete button is pressed")

    if (window.confirm(`Do you really want to delete ${contact.name} from your contact list?`)){
      // Delete the contact
      contactService
        .deleteContact(contact.id)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          showErrorMessage(`Information of ${changedContact.name} has already been removed from the server`)
        })
      
      // Update the contactsList
      setContacts( contacts.filter(c => c.id !== contact.id))
    }
  }

  // Fetch the initial data from the server
  useEffect(() => {
    // console.log('effect started')
    contactService
      .getAll()
      .then(initialContacts => {
        setContacts(initialContacts)
      })
  }, [])
  // console.log('render', contacts.length, 'contacts')

  return (
    <div>
      <Header text = {appName}/>
      <Filter filterValue={filter} onChange={handleFilterChange}/>
      <SubHeader text={'Add new contact'}/>
      <Notification msg={notificationMessage} msgStyle={notificationStyle} clearNotification={clearNotification}/>
      <DoubleInputForm 
       desc1={'name'} value1={newName} onChange1={handleNameChange}
       desc2={'phonenumber'} value2={newPhoneNumber} onChange2={handlePhoneNumberChange}
       btnTxt={'add'} onSubmit={addNewContact}/>
      <Contacts contacts={contacts} filterValue={filter} deleteCallback={deleteContact}/>
    </div>
  )
}

export default App