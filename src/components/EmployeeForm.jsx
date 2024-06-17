import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeForm = () => {
    //VARIABLE DECLARATIONS
let submittaskURL = "http://localhost:7000/user/submittask"
const Navigate = useNavigate();
const [name, setname]= useState(""); 
const [department, setdepartment]=useState("");
const [taskdetails, settaskdetails]=useState("");
const [hoursworked, sethoursworked]=useState("");
const[date, setdate]= useState("");
const[all, setall] = useState("");

//FUNCTION FOR SUBMIT BUTTON
const submit =()=>{
    //console.log(name, department, taskdetails, hoursworked, date);
    
    //SENDING DATA TO THE DATABASE THROUGH THE SERVER
  if (name || department || taskdetails || hoursworked || date)
  {
    axios.post(submittaskURL, {name, department:all, taskdetails, hoursworked, date})
    .then((response)=>{
        console.log(response)
        if(response.data.status){
            setname(""); setdepartment(""); settaskdetails(""); sethoursworked(""); setdate("");
            alert("Tasked Submitted Successfully")
            Navigate("/dashboard");
        }
        else{
            alert(response.data.message)
        }
    })
  }   
}

  return (
    <div className='container-fluid'>
      <div className='row '>
        <div className=' col-lg-12 col-12 my-4 py-2 mx-2 shadow rounded justify-content-center text-center'>
            <p className='text-primary fs-2'> <b>Daily Task Report</b></p>
            <input type="text" name='name' className='form-control my-2' placeholder='Employee name' onChange={(e)=>setname(e.target.value)}  />            
            {/* <input type="text" name='department' className='form-control my-2' placeholder='Department'  onChange={(e)=>setdepartment(e.target.value)} /> */}
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
            <input type="text" name='taskdetails' className='form-control my-2' placeholder='Task Details' onChange={(e)=>settaskdetails(e.target.value)}/>
            <input type="number" name='hoursworked' className='form-control my-2' placeholder='Hours Worked' min={0} max={12} onChange={(e)=>sethoursworked(e.target.value)} />
            <input type="date" name='date' className='form-control my-2' onChange={(e)=>setdate(e.target.value)}/>
            <button onClick={submit} className='btn btn-primary w-100 my-2' disabled={!name || !all || !date || !hoursworked || !taskdetails}> Submit </button>
        </div>
      </div>
    </div>
 
    
)
}

export default EmployeeForm
