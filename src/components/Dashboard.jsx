import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'; import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import {MDBContainer} from "mdbreact"; import { CDBContainer } from 'cdbreact';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf'; import autoTable from 'jspdf-autotable';
import "./Dashboad.css"; 
import { MdDelete } from "react-icons/md"; import { FaUserEdit } from "react-icons/fa"; 
import { IoIosCloudDownload } from "react-icons/io"; import { FaSearch } from "react-icons/fa";
import loadingGif from "../assets/loadinggif1.gif";

const Dashboard = () => {
    //https://nodejs-cap-taskmanagementserver.onrender.com
    let dashboardURL = "https://nodejs-cap-taskmanagementserver.onrender.com/user/dashboard";
    let deleteURL = "https://nodejs-cap-taskmanagementserver.onrender.com/user/delete";
    let editURL = "https://nodejs-cap-taskmanagementserver.onrender.com/user/edit";
    // let dashboardURL = "http://localhost:7000/user/dashboard";
    // let deleteURL = "http://localhost:7000/user/delete";
    // let editURL = "http://localhost:7000/user/edit";

    //VARIABLE DECLARATIONS
    const [taskarray, settaskarray] = useState([]); const[cannotLoad, setcannotLoad]=useState(false);
    const[izloading, setizloading]= useState(false); const[izloading2, setizloading2]= useState(false);
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
            { 
                setizloading2(true)
                if(!response.data.status){
                    setizloading2(false); 
                    console.log("couldnt fetch data");
                }
                else{
                    setizloading2(false)
                    settaskarray([...response.data.result]); 
                    setgeneralStatus(true);
                    let IT = response.data.result.filter(u=>(u.department=="IT")); setITtotal(IT.length);
                    let Accounting = response.data.result.filter(u=>(u.department=="Accounting")); setAccountingtotal(Accounting.length);
                    let HR = response.data.result.filter(u=>(u.department=="Human Resources")); setHRtotal(HR.length);
                    let Finance = response.data.result.filter(u=>(u.department=="Finance")); setFinancetotal(Finance.length);
                    let Marketing = response.data.result.filter(u=>(u.department=="Marketing")); setMarketingtotal(Marketing.length);
                    let Production = response.data.result.filter(u=>(u.department=="Production")); setProductiontotal(Production.length);
                    let Maintenance = response.data.result.filter(u=>(u.department=="Maintenance")); setMaintenancetotal(Maintenance.length);
                    settotal(response.data.result.length);
                }
            })
    }, [])

    //RELOAD FUNCTION
    const reload = () => { 
        setizloading2(true); setcannotLoad(true);
        axios.get(dashboardURL, { headers: {"Content-Type": "application/json", "Accept": "application/json" }})
        .then((response)=>{ 
            if(!response.data.status){ 
                setizloading2(false) 
                console.log("cannot fetch data")
            } 
        else if(response.data.status){ 
                setizloading2(false)
                settaskarray([...response.data.result]); 
                setgeneralStatus(true);
                let IT = response.data.result.filter(u=>(u.department=="IT")); setITtotal(IT.length);
                let Accounting = response.data.result.filter(u=>(u.department=="Accounting")); setAccountingtotal(Accounting.length);
                let HR = response.data.result.filter(u=>(u.department=="Human Resources")); setHRtotal(HR.length);
                let Finance = response.data.result.filter(u=>(u.department=="Finance")); setFinancetotal(Finance.length);
                let Marketing = response.data.result.filter(u=>(u.department=="Marketing")); setMarketingtotal(Marketing.length);
                let Production = response.data.result.filter(u=>(u.department=="Production")); setProductiontotal(Production.length);
                let Maintenance = response.data.result.filter(u=>(u.department=="Maintenance")); setMaintenancetotal(Maintenance.length);
                settotal(response.data.result.length);
            } 
        })
    }

    //EDIT FUNCTION
    const edittask = (each)=>
    { 
        handleShow();
        setname(each.name); setdepartment(each.department); sethoursworked(each.hoursworked); 
        settaskdetails(each.taskdetails); setid(each._id); setdate(each.date)
    }
    const confirmEdit = ()=>
    {
        if (name || department || taskdetails || hoursworked || date)
        { 
            setizloading(true)
            axios.post(editURL, {id, name, department, hoursworked, taskdetails, date})
            .then((response)=>{ 
                if(response.data.status)
                    {
                        setizloading(false)
                        alert(response.data.message); 
                        reload();
                        handleClose();
                    }
                else{setizloading(false); alert(response.data.message)}
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
                seterrorMsg("Please select Department or Name")
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
    
    //PDF DOWNLOAD FUNCTION
    console.log(taskarray);
    //const data2 = [['david', 'cse', '20', 'sweeping'],['david', 'cse', '20', 'sweeping'] ]
    const pdfdata = taskarray.map((each, index)=>([index+1, each.name, each.department, each.date, each.taskdetails, each.hoursworked]))
    const handleDownloadPdf = ()=> {
        const doc = new jsPDF();
         doc.text(" ", 10, 10);
         doc.autoTable({
            theme:'grid',
            startY:20,
            head:[['S/N', 'Name', 'Department', 'Date', 'Task Details', 'Hours Worked']],
            body:pdfdata,
         });
        doc.save("TaskDetails.pdf");
      }  

  return (
    <div className='container-fluid'>
      <div className='row rounded'>
        <div className='col-12'>
    
            {/* DESKTOP VIEW */}
            <div id='desktop'>
                <div id='' className='d-flex shadow px-3 py-2 justify-content-center bg-primary rounded' style={{position:"sticky", top:"0", zIndex:1}}>
                    <span id='' className='shadow me-5 px-2 rounded animate__animated animate__pulse animate__delay-2s  animate__infinite infinite animate__slower'>
                        <Link className='text-white' to='/dashboard'> <i>Dashboard</i></Link> <br /> 
                        <Link className='text-white me-2 ms-1' to='/form'><i>TaskForm</i> </Link>
                    </span>
                    <input type="text" placeholder='Enter Department or Name' className='form-control w-25'  onChange={(e) => setsearch(e.target.value)} />
                    <span className='mx-2'>
                        <select className=" my-2 form-select w-100 "id="" value={all} style={{zIndex:1}} onChange={(e) => setall(e.target.value)}>
                            <option value="">Select Department or Name</option>
                            <option value="department">Department</option>
                            <option value="name">Name</option>
                        </select>
                    </span>   
                    <button className='btn btn-small w-25 search_button shadow' onClick={filter}><FaSearch /><b className='ms-3'>Search</b> </button> 
                </div>           
            
                <p className='text-danger fs-5'><b>{errorMsg}</b></p>


                <p className='display-4 my-3 text-secondary' style={{letterSpacing:"10px"}}> <b>Task Report</b> </p>  <hr />
                {
                    generalStatus?
                    <>
                        {
                            taskarray.length==0?
                            <>
                                <div className=''> <img className='w-75' src={loadingGif} alt="" /> </div>
                                <p className='alert alert-info w-75 d-flex mx-auto justify-content-center animate__animated animate__flash animate__delay-1s  animate__infinite infinite animate__slower'>  <b>Please ensure you are connected to the internet</b></p>
                            </>:
                            <>
                                <div style={{height:"40vh", overflow:"scroll"}}>
                                    <table className='table table-sm table-striped table-hover '>
                                        <tbody>
                                            <tr className=''>
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
                                                    <td><button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'><FaUserEdit /></button> </td>                             
                                                    <td><button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'><MdDelete /></button></td>                                        
                                                </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        }
                        <button className='btn mt-2 btn-primary w-75 animate__animated animate__pulse animate__delay-2s  animate__infinite infinite animate__slower' 
                            onClick={handleDownloadPdf}> <b style={{letterSpacing:"15px"}}><IoIosCloudDownload /> <span>Download Report</span></b> </button> <hr />
                        <div className=' row d-flex justify-content-center my-5'>
                            {/* *******CHART******* */}
                            <div className='col-lg-6 shadow rounded py-2 '>      
                                <p className='display-3 text-secondary' style={{letterSpacing:"10px"}}> <b>Summary</b></p> <hr />
                                <Doughnut  data={data} options={{ responsive: true }} />  <hr />
                                <p className=' text-secondary animate__animated animate__pulse animate__delay-2s  animate__infinite infinite animate__slower'>
                                    <h1 style={{letterSpacing:"20px"}}><b> Total Task</b></h1> 
                                    <h1 style={{letterSpacing:"20px"}}><b>{total} </b></h1>
                                </p>
                            </div>
                        </div>
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
                            <div style={{height:"40vh", overflow:"scroll"}}> 
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
                                                <td><button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'><FaUserEdit /></button> </td>                             
                                                <td><button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger '><MdDelete /></button></td>                                        
                                            </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
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
                            <div style={{height:"40vh", overflow:"scroll"}} >
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
                                                <td><button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'><FaUserEdit /></button> </td>                             
                                                <td><button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'><MdDelete /></button></td>                                        
                                            </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            </>
                        }
                    </>:<></>
                }
            </div>

            {/* MOBILE VIEW */}
            <div id='mobile'>
                <div className='row'>
                    <div className='col-12'>
                        <span className='  '>
                            <Link className='text-primary mx-1 rounded shadow px-3 py-1' to='/'> <i>Dashboard</i></Link> 
                            <Link className='text-primary mx-1 rounded shadow px-3 py-1' to='/form'><i>Task Form</i> </Link>
                        </span>
                        <div className=' mt-4 bg-primary py-2 px-2 rounded' style={{ }}>
                            <input type="text" placeholder='Enter Department or Name' className='form-control w-100'  onChange={(e) => setsearch(e.target.value)} />
                                <select className=" my-2 form-select w-100 "id="" value={all} style={{zIndex:1}} onChange={(e) => setall(e.target.value)}>
                                    <option value="">Select Department or Name</option>
                                    <option value="department">Department</option>
                                    <option value="name">Name</option>
                                </select>
                            <button className='btn btn-small w-100 search_button shadow' onClick={filter}> <b >Search</b> </button>
                        </div>
                    </div>
                    <div className='col-12'>
                        <p className='display-4 my-3 text-secondary' style={{letterSpacing:"5px"}}> <b>Task Report</b> </p>  <hr />
                        {
                            generalStatus?
                            <> 
                                <div style={{height:"40vh", overflow:"scroll"}}>
                                    {
                                        taskarray.length==0?
                                        <>
                                             <div className=''> <img className='w-75' src={loadingGif} alt="" /> </div>
                                             <p className='alert alert-info w-75 d-flex mx-auto justify-content-center animate__animated animate__flash animate__delay-1s  animate__infinite infinite animate__slower'>  <b>Please ensure you are connected to the internet</b></p>
                                        </>:
                                        <>
                                            {
                                                taskarray.map((each, index)=>(
                                                    
                                                        <p className='d-flex text-left justify-content-left '>{index+1}. {each.name}-{each.department}-({each.date})-{each.taskdetails}-{each.hoursworked}hour(s) 
                                                            <span>
                                                                <button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'><FaUserEdit /></button>                              
                                                                <button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'><MdDelete /></button> 
                                                            </span> 
                                                        </p> 
                                                ))
                                            }
                                        </>
                                    }
                                    
                                </div>
                                <button className='btn btn-primary mt-4 w-50 animate__animated animate__pulse animate__delay-2s  animate__infinite infinite animate__slower' 
                                    onClick={handleDownloadPdf}> <b style={{letterSpacing:"5px"}}>Download Report</b> </button> <hr />

                                <div className='col-12 shadow rounded py-2 '>      
                                    <p className='display-5 text-secondary' style={{letterSpacing:"5px"}}> <b>Summary</b></p> <hr />
                                    <Doughnut  data={data} options={{ responsive: true }} />  <hr />
                                    <p className=' text-secondary animate__animated animate__pulse animate__delay-2s  animate__infinite infinite animate__slower' style={{borderRadius:"100%"}}>
                                        <h1 style={{letterSpacing:"10px"}}><b> Total Task</b></h1> 
                                        <h1 style={{letterSpacing:"10px"}}><b>{total} </b></h1>
                                    </p>
                                </div>
                            </>:<></>
                        } 
                    </div>
                </div>

                { 
                    departmentStatus?
                    <>
                        {
                            searchbydepartment.length==0 ?
                            <>
                                <p className='text-danger fs-3 my-5  '> <b> <span className='text-primary'>"{search2}"</span> Department not found</b> </p>
                            </>:
                            <>  
                            <div style={{height:"40vh", overflow:"scroll"}}>
                                {
                                    searchbydepartment.map((each, index)=>(
                                        <p className=' d-flex text-left justify-content-left '>{index+1}. {each.name}-{each.department}-({each.date})-{each.taskdetails}-{each.hoursworked}hour(s) 
                                            <span>
                                                <button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'><FaUserEdit /></button>                              
                                                <button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'><MdDelete /></button> 
                                            </span> 
                                        </p> 
                                    ))
                                }
                            </div>
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
                                <div style={{height:"40vh", overflow:"scroll"}}>
                                    {
                                        searchbyname.map((each, index)=>(
                                            <p className=' d-flex text-left justify-content-left '>{index+1}. {each.name}-{each.department}-({each.date})-{each.taskdetails}-{each.hoursworked}hour(s) 
                                                <span>
                                                    <button onClick={()=>edittask(each)} className='btn btn-small btn-outline-primary'><FaUserEdit /></button>                              
                                                    <button onClick={()=>deletetask(each)} className='btn btn-small btn-outline-danger'><MdDelete /></button> 
                                                </span> 
                                            </p> 
                                        ))
                                    }
                                </div>
                            </>
                        }
                    </>:<></>
                }
                </div>
                
                
            </div> 
      </div>
        {/* SIGNIN MODAL */}
        <Modal show={show} onHide={handleClose} size="md" aria-labelledby="contained-modal-title-center" centered  style={{border:"1px solid red",letterSpacing:"0.2em" }} >
        <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-center" className='d-flex justify-content-center ms-5 mx-5 text-center text-primary' style={{}}> Edit Task  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <input type="text" name='name' className='form-control my-2' value={name} onChange={(e)=>setname(e.target.value)}  />            
            {/* <input type="text" name='department' className='form-control my-2' value={department}  onChange={(e)=>setdepartment(e.target.value)} /> */}
            <select className=" my-2 form-select "id="" value={department} style={{zIndex:1}} onChange={(e) => setdepartment(e.target.value)}>
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Production">Production</option>
                  <option value="Maintenance">Maintenance</option>
            </select>
            <input type="text" name='taskdetails' className='form-control my-2' value={taskdetails} onChange={(e)=>settaskdetails(e.target.value)}/>
            <input type="number" name='hoursworked' className='form-control my-2' value={hoursworked} min={0} max={12} onChange={(e)=>sethoursworked(e.target.value)} />
            <input type="hidden" name='date' className='form-control my-2' value={date} onChange={(e)=>setdate(e.target.value)}/>
            {
              izloading ?
              <>
                <button className='btn btn-outline-primary w-100 my-2' disabled><Spinner as="span" variant='white' animation="grow" size="sm" role="status" aria-hidden="true" /> Loading ... </button>
              </>: 
              <>
                 <button onClick={confirmEdit} className='btn btn-outline-primary w-100 my-2' disabled={!name || !department || !hoursworked || !taskdetails}> Confirm Edit </button>
              </>
            }
        </Modal.Body>
        <Modal.Footer> <Button variant="danger" onClick={handleClose}> Close </Button> </Modal.Footer>
    </Modal>

    </div>
  )
}

export default Dashboard
