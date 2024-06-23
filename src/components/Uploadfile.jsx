import React from 'react'
import { CSVImporter } from 'csv-import-react'
import { useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate, Link } from 'react-router-dom';

const Uploadfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [excelbook, setexcelbook ] = useState([]) 
    const [uploadstatus, setuploadstatus]= useState(false)
    const[uploadizloading, setuploadizloading] = useState(false);
    const now = "uploading"; const [alert, setalert] = useState(false); const[falsealert, setfalsealert] = useState(false);
    const Navigate = useNavigate();
    let submittaskURL = "https://nodejs-cap-taskmanagementserver.onrender.com/user/submittask"

    //SUBMIT FUNCTION
    const submit= ()=>
    {
        setuploadizloading(true); setuploadstatus(false); 
        for (let i = 0; i<excelbook.length; i++)
            {
                axios.post(submittaskURL, 
                    {
                        name:excelbook[i].values.employee_name, department:excelbook[i].values.department, taskdetails:excelbook[i].values.task_details, 
                        hoursworked:excelbook[i].values.hours_worked, date:excelbook[i].values.date 
                    })
                     .then((response)=>{
                     // console.log(response);
                      setuploadizloading(false);
                     if(response.data.status){
                        setalert(true); setfalsealert(false);
                    }
                    else{
                        setizloading(false); setalert(false); setfalsealert(true);
                    }
                })
            }
    }
    
    return (
    <div className='row'>
        {/* -------NAV BAR------------- */}
        <div className=' py-2 shadow rounded bg-primary' style={{backgroundColor:""}}>
                <Link className='text-primary bg-white mx-1 rounded shadow px-3 py-1' to='/dashboard'> <i>Dashboard</i></Link> 
                <Link className='text-primary bg-white mx-1 rounded shadow px-3 py-1' to='/form'><i>Task Form</i> </Link>
        </div> <hr />

        {/* ---------------DISPLAY UPLOAD STATUS---------------- */}
         <div className=' col-12 shadow px-5 py-5 rounded'>
            {
                alert ?
                <>
                    <p className='alert alert-success'>Uploaded Successfully </p>
                </>:
                <></>
            }
            {
                falsealert?
                <>
                    <p className='alert alert-danger'> Upload Failed</p>
                </>:
                <></>
            }
         <button className='btn btn-outline-dark my-2' onClick={() => setIsOpen(true)}>Upload Excel File</button>
        
        {/* -----------------------------UPLOAD MODAL---------------- */}
        <CSVImporter  
            modalIsOpen={isOpen}
            modalOnCloseTriggered={() => setIsOpen(false)}
            darkMode={false}
            onComplete={(data) => 
                {
                    setIsOpen(false)
                    setexcelbook(data.rows);
                    setuploadstatus(true);
                }
                            
            }
        
            template={{
                columns: [
                {
                    name: "Employee Name",
                    key: "employee_name",
                    required: true,
                    description: "The first and last name of employee",
                    suggested_mappings: ["Employee", "Name"],
                },
                {
                    name:"Department",
                    data_type:"string",
                    required:true,
                },
                {
                    name:"Task Details",
                    data_type:"string",
                    required:true,
                },
                {
                    name: "Hours Worked",
                    data_type: "number",
                    required:true,
                },
                {
                    name:"Date",
                    data_type:"number",
                    required:true,
                },

                ],
        }}
        
        />

        {
            uploadizloading?
            <>
                {/* <button className='btn btn-primary w-100 my-2' disabled ><Spinner as="span" variant='white' animation="grow" size="sm" role="status" aria-hidden="true" /></button> */}
                <ProgressBar animated now={100} label={`${now}`} />
            </>:
            <>
                <button className='btn btn-primary w-100 my-2' onClick={submit}>Submit</button>
            </>
        }
        {
            uploadstatus?
            <>
                <p className='alert alert-info animate__animated animate__flash animate__delay-5s  animate__infinite infinite animate__slower'> Click <b>"Submit"</b> to finish the upload process</p>
            </>:
            <>
            </>
        }
         </div>
    </div>
  )
}

export default Uploadfile
