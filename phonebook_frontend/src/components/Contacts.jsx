import { SubHeader } from "./Headers"

const Contacts = ({ contacts, filterValue, deleteCallback }) => {
  // Don't render if there are no contacts yet (e.g. not yet fetched from the backend)
  if (contacts === null){
    return null
  }

  // console.log("🚀 ~ file: Contacts.jsx:25 ~ Contacts ~ filterValue:", filterValue)
  const contactsToShow = (filterValue !== '')
    ? contacts.filter(contact => contact.name.toLowerCase().includes(filterValue.toLowerCase()))
    : contacts
  // console.log("🚀 ~ file: Contacts.jsx:27 ~ Contacts ~ contactsToShow:", contactsToShow)

  return(
    <>
      <SubHeader text={'Contacts'} />
      {contactsToShow.map((contact) => (
        <div key={contact.id}>
          <p> {contact.name} <br/> {contact.number} </p>
          <button onClick={() => deleteCallback(contact)}> delete </button> 
        </div>
        
      ))}
    </>
  )
}

export default Contacts