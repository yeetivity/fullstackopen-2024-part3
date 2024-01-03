const DoubleInputForm = ({ desc1, value1, onChange1, desc2, value2, onChange2, btnTxt, onSubmit }) => {
    // console.log("🚀 ~ file: App.jsx:8 ~ InputForm ~ desc, value, onChange, btnTxt, onSubmit:", desc, value, onChange, btnTxt, onSubmit)
    return(
      <form onSubmit={onSubmit}>
          <div> 
            {desc1}: <input value={value1} onChange={onChange1}/> 
          </div>
          <div> 
            {desc2}: <input value={value2} onChange={onChange2}/> 
          </div>
          <div>
            <button type="submit">{btnTxt}</button>
          </div>
      </form>
    )
  }

export default DoubleInputForm