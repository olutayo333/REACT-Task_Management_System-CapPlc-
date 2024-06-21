import React from 'react'
import { CSVImporter } from 'csv-import-react'
import { useState } from 'react';
import axios from 'axios';


const Uploadfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [excelbook, setexcelbook ] = useState([]) 
    const [uploadstatus, setuploadstatus]= useState(false)
    let submittaskURL = "https://nodejs-cap-taskmanagementserver.onrender.com/user/submittask"

    console.log(excelbook);
    
    const submit= ()=>{
        axios.post(submittaskURL, {excelbook})
        .then((response)=>{
            console.log(response);
            setuploadstatus(false)
            // if(response.data.status){
            //     alert("Tasked Submitted Successfully")
            //     Navigate("/dashboard");
            // }
            // else{
            //     alert(response.data.message)
            //     setizloading(false)
            // }
        })
    }
    
    return (
    <div>
         <button onClick={() => setIsOpen(true)}>Open CSV Importer</button>

        <CSVImporter
        modalIsOpen={isOpen}
        modalOnCloseTriggered={() => setIsOpen(false)}
        darkMode={true}
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
        <button onClick={submit}>Upload</button>
    </div>
  )
}

export default Uploadfile
