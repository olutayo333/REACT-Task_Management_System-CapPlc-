import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import EmployeeForm from './components/EmployeeForm';
import Dashboard from './components/Dashboard';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          
          <Route path='home' element={<Home/>} />
          
          <Route path='form' element={<EmployeeForm/>} />
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path='/*' element={<Home/>}/>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
