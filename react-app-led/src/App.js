import React, {  } from "react";
import "./App.css";
 
import Home from "./components/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Edit from "./components/Edit";

 
function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
              <Route exact path="/" element={<Home/>}/> //MAIN ROUTE
              <Route path="/edit/:hotel" element={<Edit />} /> //EDIT ROUTE
            </Routes>
        </Router>
    </div>
  );
}
 
export default App;