import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'; import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import {MDBContainer} from "mdbreact";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CDBContainer } from 'cdbreact';

const Dashboard = () => {
    let dashboardURL = "http://localhost:7000/user/dashboard";
    let deleteURL = "http://localhost:7000/user/delete";
    let editURL = "http://localhost:7000/user/edit";

    //VARIABLE DECLARATIONS
    const [taskarray, settaskarray] = useState([]); 
    const [searchbydepartment, setsearchbydepartment] = useState([]); const [searchbyname, setsearchbyname] = useState([]);
    const [show, setShow] = useState(false); const handleClose = () => setShow(false); const handleShow = () => setShow(true);  
    const [name, setname]= useState("");  const [department, setdepartment]=useState("");
    const [taskdetails, settaskdetails]=useState(""); const [hoursworked, sethoursworked]=useState("");
    const[id, setid]=useState(""); const[date, setdate]= useState(""); const[search, setsearch]= useState(""); const[search2, setsearch2]= useState("");
    const [all, setall]=useState(""); const[errorMsg, seterrorMsg]=useState("");
    const [departmentStatus, setdepartmentStatus]= useState(false); const [nameStatus, setnameStatus]= useState(false);
    const [generalStatus, setgeneralStatus] = useState(true);
    const[ITtotal, setITtotal] = useState(""); const[Accountingtotal, setAccountingtotal]=useState(""); const[total, settotal]=useState("")
    const[HRtotal, setHRtotal]= useState(""); const[Financetotal, setFinancetotal]=useState(""); const[Marketingtotal, setMarketingtotal]=useState("");
    const[Productiontotal, setProductiontotal]=useState(""); const[Maintenancetotal, setMaintenancetotal]=useState(""); 
    
    //LOADING TASKS FROM THE DATABASE
    useEffect(()=>{
        axios.get(dashboardURL, { headers: {"Content-Type": "application/json", "Accept": "application/json" }})
        .then((response)=>
            { console.log(response);
                if(!response.data.status){
                    console.log("couldnt fetch data");
                }
                else{
                    settaskarray([...response.data.result]); 
                    console.log(taskarray);
                    setgeneralStatus(true);
                    let IT = response.data.result.filter(u=>(u.department=="IT")); setITtotal(IT.length);
                    let Accounting = response.data.result.filter(u=>(u.department=="Accounting")); setAccountingtotal(Accounting.length);
                    let HR = response.data.result.filter(u=>(u.department=="Human Resources")); setHRtotal(HR.length);
                    let Finance = response.data.result.filter(u=>(u.department=="Finace")); setFinancetotal(Finance.length);
                    let Marketing = response.data.result.filter(u=>(u.department=="Marketing")); setMarketingtotal(Marketing.length);
                    let Production = response.data.result.filter(u=>(u.department=="Production")); setProductiontotal(Production.length);
                    let Maintenance = response.data.result.filter(u=>(u.department=="Maintenance")); setMaintenancetotal(Maintenance.length);
                    // settotal(ITtotal + Accountingtotal + HRtotal + Financetotal + Marketingtotal + Productiontotal + Maintenancetotal);
                    settotal(response.data.result.length); console.log(response.data.result.length);
                }
            })
    }, [])

    //RELOAD FUNCTION
    const reload = () => 
    { 
        axios.get(dashboardURL, { headers: {"Content-Type": "application/json", "Accept": "application/json" }})
        .then((response)=>{ if(!response.data.status){  console.log("cannot fetch data")} 
        else if(response.data.status){ settaskarray([...response.data.result]); } })
    }

    //EDIT FUNCTION
    const edittask = (each)=>
    { 
        console.log(each);
        handleShow();
        setname(each.name); setdepartment(each.department); sethoursworked(each.hoursworked); 
        settaskdetails(each.taskdetails); setid(each._id); setdate(each.date)
        console.log(id);
    }
    const confirmEdit = ()=>
    {
        if (name || department || taskdetails || hoursworked || date)
        {
            axios.post(editURL, {id, name, department, hoursworked, taskdetails, date})
            .then((response)=>{ console.log(response);
                if(response.data.status)
                    {
                        alert(response.data.message); 
                        reload();
                        handleClose();
                    }
                else{alert(response.data.message)}
            })
        }
    }

    //DELETE FUNCTION 
    const deletetask = (each)=>{
        alert("Are you sure you want to delete ?", each.index+1)
        let _id = each._id;
        axios.post(deleteURL, {_id})
        .then((response)=>{
        if (response.data.status){alert(response.data.message); reload() } 
        else{console.log(response.data.message); alert(response.data.message)}
      })
    }

    // SEARCH FUNCTION
    const filter = ()=>{
        if (!all)
            {
                seterrorMsg("Please select search by department or name")
            }
        else
        {
            seterrorMsg(""); setsearch2(search);
            if(all=="department")
                {
                    let result = taskarray.filter(u=>(u.department.toLowerCase()==search.toLowerCase()));
                    setsearchbydepartment([...result]);
                    console.log( searchbydepartment);
                     setdepartmentStatus(true); setnameStatus(false); setgeneralStatus(false)
                }
                else if (all=="name")
                {
                    let result = taskarray.filter(u=>(u.name.toLowerCase()==search.toLowerCase()));
                    setsearchbyname([...result]);
                    console.log( searchbyname);
                     setnameStatus(true); setdepartmentStatus(false); setgeneralStatus(false);
                }
        }
    }
    
    // SUMMARY DATA
    const data ={
        labels:["I.T", "Accounting", "Finance", "Human Resources", "Marketing", "Production", "Maintenance"],
        datasets:[
            {
                labels:"Statistics By Deoartment",
                data:[ITtotal,Accountingtotal,Financetotal,HRtotal, Marketingtotal, Productiontotal,Maintenancetotal],
                backgroundColor:['blue', 'green', 'yellow', 'pink', 'orange', 'red', 'purple' ]
            }
        ]
    }
    ChartJS.register(ArcElement, Tooltip, Legend);
    //,,   ,      
  return (
    <div className='container-fluid'>
      <div className='row shadow rounded'>
        <div className='col-12'>
            <select className=" my-2 form-select "id="" value={all} style={{zIndex:1}} onChange={(e) => setall(e.target.value)}>
                  <option value="">Select Department or Name</option>
                  <option value="department">Department</option>
                  <option value="name">Name</option>
            </select>           
            <p className='text-danger'>{errorMsg}</p>
            <button onClick={filter}> Filter </button>

            <p className='fs-1 my-3 text-primary' style={{letterSpacing:"10px"}}> <u>Task Submited</u> </p>
            {
                generalStatus?
                <>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th> S/N </th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Date Created</th>
                                <th> Task Details </th>
                                <th> Hours Worked </th>
                            </tr> 

                            {
                                taskarray.map((each, index)=>(
                                <tr key={index}>
                                    <td> {index+1} </td>
                                    {/* <td>{each._id}</td> */}
                                    <td>{each.name} </td>  
                                    <td>{each.department}</td>
                                    <td>{each.date}</td>
                                    <td>{each.taskdetails}</td>
                                    <td>{each.hoursworked}</td>
                                    <td><button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'>Edit</button> </td>                             
                                    <td><button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'>Delete</button></td>                                        
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </>:<></>
            } 
            { 
                departmentStatus?
                <>
                    {
                        searchbydepartment.length==0 ?
                        <>
                            <p className='text-danger fs-3 my-5  '> <b> <span className='text-primary'>"{search2}"</span> Department not found</b> </p>
                        </>:
                        <>   
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <th> S/N </th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Date Created</th>
                                        <th> Task Details </th>
                                        <th> Hours Worked </th>
                                    </tr> 
                                    {
                                        searchbydepartment.map((each, index)=>(
                                        <tr key={index}>
                                            <td> {index+1} </td>
                                            {/* <td>{each._id}</td> */}
                                            <td>{each.name} </td>  
                                            <td>{each.department}</td>
                                            <td>{each.date}</td>
                                            <td>{each.taskdetails}</td>
                                            <td>{each.hoursworked}</td>
                                            <td><button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'>Edit</button> </td>                             
                                            <td><button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'>Delete</button></td>                                        
                                        </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </>
                    }
                </>:<></>
            }
            {
                nameStatus?
                <>
                    {
                        searchbyname.length==0?
                        <>
                            <p className='text-danger fs-3 my-5  '> <b>Name <span className='text-primary'>"{search2}"</span> not found</b> </p>
                        </>:
                        <>
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <th> S/N </th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Date Created</th>
                                        <th> Task Details </th>
                                        <th> Hours Worked </th>
                                    </tr> 
                                    {
                                        searchbyname.map((each, index)=>(
                                        <tr key={index}>
                                            <td> {index+1} </td>
                                            {/* <td>{each._id}</td> */}
                                            <td>{each.name} </td>  
                                            <td>{each.department}</td>
                                            <td>{each.date}</td>
                                            <td>{each.taskdetails}</td>
                                            <td>{each.hoursworked}</td>
                                            <td><button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'>Edit</button> </td>                             
                                            <td><button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'>Delete</button></td>                                        
                                        </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </>
                    }
                </>:<></>
            }
            <CDBContainer>
                 Task Summary
                <Doughnut data={data} options={{ responsive: true }} />
                Total Task = {total}
             </CDBContainer>
             {/* <MDBContainer>
                 Chart JS
                <Doughnut data={data} />
             </MDBContainer>
             <>
                 Chart JS
                <Doughnut data={data} />
             </> */}
        </div> 
      </div>
        {/* SIGNIN MODAL */}
        <Modal show={show} onHide={handleClose} size="md" aria-labelledby="contained-modal-title-center" centered  style={{border:"1px solid red",letterSpacing:"0.2em" }} >
        <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-center" className='d-flex justify-content-center ms-5 mx-5 text-center' style={{}}> Edit Task  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <input type="text" name='name' className='form-control my-2' value={name} onChange={(e)=>setname(e.target.value)}  />            
            <input type="text" name='department' className='form-control my-2' value={department}  onChange={(e)=>setdepartment(e.target.value)} />
            <input type="text" name='taskdetails' className='form-control my-2' value={taskdetails} onChange={(e)=>settaskdetails(e.target.value)}/>
            <input type="number" name='hoursworked' className='form-control my-2' value={hoursworked} min={0} max={12} onChange={(e)=>sethoursworked(e.target.value)} />
            <input type="hidden" name='date' className='form-control my-2' value={date} onChange={(e)=>setdate(e.target.value)}/>
            <button onClick={confirmEdit} className='btn btn-outline-primary w-100 my-2' disabled={!name || !department || !hoursworked || !taskdetails}> Confirm Edit </button>
        </Modal.Body>
        <Modal.Footer> <Button variant="secondary" onClick={handleClose}> Close </Button> </Modal.Footer>
    </Modal>

    </div>
  )
}

export default Dashboard
