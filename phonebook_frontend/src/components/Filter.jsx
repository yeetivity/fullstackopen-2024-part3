const Filter = ({ filterValue, onChange }) => {
    return(
      <div>
        search for name: <input value={filterValue} onChange={onChange}/>
      </div>
    )
  }

export default Filter