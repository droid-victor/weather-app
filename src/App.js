import React from 'react'
import CurrentLocation from './Components/CurrentLocation'
import "./App.css";
// import Forecast from './Components/Forecast';
const App = () => {
  return (
    <div className="container">
      <CurrentLocation/>
      {/* <Forecast/> */}
    </div>
  )
}

export default App