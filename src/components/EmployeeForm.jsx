import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const EmployeeForm = () => {
    //VARIABLE DECLARATIONS
let submittaskURL = "https://nodejs-cap-taskmanagementserver.onrender.com/user/submittask"
const Navigate = useNavigate();
const [name, setname]= useState(""); 
const [department, setdepartment]=useState("");
const [taskdetails, settaskdetails]=useState("");
const [hoursworked, sethoursworked]=useState("");
const[date, setdate]= useState("");
const[all, setall] = useState("");
const [izloading, setizloading] = useState(false);
const[validname, setvalidname] = useState(true);
const[validtaskdetails , setvalidtaskdetails] = useState(true);

//FUNCTION FOR SUBMIT BUTTON
const submit =()=>{
  //SENDING DATA TO THE DATABASE THROUGH THE SERVER
  if (name || department || taskdetails || hoursworked || date)
  {
    setizloading(true)
    axios.post(submittaskURL, {name, department:all, taskdetails, hoursworked, date})
    .then((response)=>{
        if(response.data.status){
            setizloading(false)
            setname(""); setdepartment(""); settaskdetails(""); sethoursworked(""); setdate("");
            alert("Tasked Submitted Successfully")
            Navigate("/dashboard");
        }
        else{
            alert(response.data.message)
            setizloading(false)
        }
    })
  }   
}

  //  VERIFYING INPUTS
  const verifyName =(e)=>
  {    const nameRegEx = /^([a-zA-Z]{2,15})+([\s][a-zA-Z]{2,15})+$/  
       const name2 = e.target.value; 
       setname(e.target.value);  
       setvalidname(nameRegEx.test(name2)); 
  }
  const verifyTaskDetails =(e)=>
    {    const taskDetailsRegEx = /^[a-zA-Z\s]*$/  
         const taskdetails2 = e.target.value; 
         settaskdetails(e.target.value); console.log(taskdetails); 
         setvalidtaskdetails(taskDetailsRegEx.test(taskdetails2)); 
    }

  return (
    <div className='container-fluid'>
      <div className='row '>
        <div className=' col-lg-12 my-2 py-2 mx-2 shadow rounded justify-content-center text-center'>
            <div className=' bg-primary py-2 shadow rounded'>
                <Link className='text-primary bg-white mx-1 rounded shadow px-3 py-1' to='/dashboard'> <i>Dashboard</i></Link> 
                <Link className='text-primary bg-white mx-1 rounded shadow px-3 py-1' to='/form'><i>Task Form</i> </Link>
            </div> <hr />
            <p className='text-primary fs-2'> <b>Employee Task Form</b></p> 
            
            {
              validname? 
              <>
                <input type="text" name='name' className='form-control my-2' placeholder='Employee name' onChange={verifyName} required/>
              </> :
              <>
                <input type="text" className='form-control is-invalid'  placeholder='Firstname&nbsp;&nbsp;Lastname  ' onChange={verifyName} required />
                <small className='invalid-feedback'>Please enter your First name and Last name</small>  
              </>
            }
                  <select className=" my-2 form-select "id="" value={all} style={{zIndex:1}} onChange={(e) => setall(e.target.value)}>
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Production">Production</option>
                  <option value="Maintenance">Maintenance</option>
            </select> 
            {
              validtaskdetails? 
              <>
                 <input type="text" name='taskdetails' className='form-control my-2' placeholder='Task Details' onChange={verifyTaskDetails} required/>
              </> :
              <>
                <input type="text" className='form-control is-invalid'   placeholder='Task Details' onChange={verifyTaskDetails} required />
                <small className='invalid-feedback'>Please enter valid task details</small>  
              </>
            }
            {/* <input type="text" name='taskdetails' className='form-control my-2' placeholder='Task Details' onChange={(e)=>settaskdetails(e.target.value)}/> */}
            <input type="number" name='hoursworked' className='form-control my-2' placeholder='Hours Worked' min={0} max={12} onChange={(e)=>sethoursworked(e.target.value)} />
            <input type="date" name='date' className='form-control my-2' onChange={(e)=>setdate(e.target.value)}/>
            {
              izloading ?
              <>
                <button className='btn btn-primary w-100 my-2' disabled> <Spinner as="span" variant='white' animation="grow" size="sm" role="status" aria-hidden="true" /><b>Loading...</b> </button>
              </>: 
              <>
                <button onClick={submit} className='btn btn-primary w-100 my-2' disabled={!validname || !name || !all || !date || !hoursworked || !taskdetails }> Submit </button>
              </>
            } <hr />
            <Link to="/upload" style={{letterSpacing:"2px"}}><i><u>Upload Task in Excel Document</u></i> </Link>
        </div>
      </div>
    </div>
 
    
)
}

export default EmployeeForm
