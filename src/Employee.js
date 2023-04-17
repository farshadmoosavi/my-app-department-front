import React, { useState, useEffect } from "react";
import { json } from "react-router-dom";
import { Variables } from "./Variables";
import "react-datepicker/dist/react-datepicker.css";

export const Employee = () => {
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState("");
    const [employees, setEmployees] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState(new Date());
    const [photoFileName, setPhotoFileName] = useState("anonymous.png");
    const [photoPath, setPhotoPath] = useState(Variables.PHOTO_URL);


    const refreshList = () => {
        fetch(`${Variables.API_URL}employee`)
            .then((response) => response.json())
            .then((data) => {
                setEmployees(data);
            })
            .catch((error) => console.log(error));

        fetch(`${Variables.API_URL}department`)
            .then((response) => response.json())
            .then((data) => {
                setDepartments(data);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        refreshList();
    }, []);

    const addClick = () => {
        setModalTitle("Add Employee");
        setEmployeeId(0);
        setEmployeeName("");
        setDepartment("");
        setDateOfJoining(new Date());
        setPhotoFileName("anonymous.png");
    };

    const editClick = (emp) => {
        setModalTitle("Edit Employee");
        setEmployeeId(emp.EmployeeId);
        setEmployeeName(emp.EmployeeName);
        setDepartment(emp.Department);
        setDateOfJoining(new Date(emp.DateOfJoining));
        setPhotoFileName(emp.PhotoFileName);
        refreshList();  // added by me 
    };

    const createClick = () => {
        fetch(`${Variables.API_URL}employee`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employeeName: employeeName,
                department: department,
                dateOfJoining: dateOfJoining,
                photoFileName: photoFileName
            })
        }).then(res => res.json)
            .then((result) => {
                alert(result);
                refreshList();
            }, (error) => { alert("Failed") })
    }

    const updateClick = () => {
        fetch(`${Variables.API_URL}employee`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employeeId: employeeId,
                employeeName: employeeName,
                department: department,
                dateOfJoining: dateOfJoining,
                photoFileName: photoFileName
            })
        }).then(res => res.json)
            .then((result) => {
                alert(result);
                refreshList();
            }, (error) => { alert("Failed") })
    }

    const deleteClick = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${Variables.API_URL}employee/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then((result) => {
                    alert(result);
                    refreshList();
                }, (error) => { alert("Failed") })
        }
    }

    const imageUpload = (e) => {
        e.preventDefault();
        console.log("first in func" + photoFileName);
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        fetch("https://localhost:7124/api/employee/SaveFile", {
            method: 'POST',
            body: formData,
        }).then(res => res.json()).then(data => {
            setPhotoFileName(data);
            console.log(data);
        }).catch(err => console.log(err));
    }

    return (
        <div>
            <button
                type="button"
                className="btn btn-primary m-2 float-end"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={addClick}
            >
                Add Employee
            </button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Department</th>
                        <th>Date Of Joining</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.EmployeeId}>
                            <td>{emp.EmployeeId}</td>
                            <td>{emp.EmployeeName}</td>
                            <td>{emp.Department}</td>
                            <td>{emp.DateOfJoining}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-light mr-1"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() => editClick(emp)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </button>
                                <button type="button" className="btn btn-light mr-1" onClick={() => deleteClick(emp.EmployeeId)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* this two div class d-flex is added for depicting photo */}
                            <div className="d-flex flex-row bd-highlight mb-3">
                                <div className="p-2 w-50 bd-highlight">

                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Employee Name</span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={employeeName}
                                            onChange={(e) => setEmployeeName(e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Department </span>
                                        <select className="form-select" onChange={(e) => setDepartment(e.target.value)} value={department}>
                                            {departments.map((dep) => <option key={dep.DepartmentId}>{dep.DepartmentName}</option>)}
                                        </select>
                                    </div>

                                    <div className="input-group mb-3">
                                        <span className="input-group-text">Date Of Joining</span>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={dateOfJoining}
                                            onChange={(e) => setDateOfJoining(e.target.value)}
                                        />
                                    </div>

                                </div>
                                <div className="p-4 w-50 bd-highlight border">
                                    <img width="250px" height="250px"
                                        src={photoPath + photoFileName} />
                                    <input className="m-2" type="file" onChange={imageUpload} />
                                </div>


                            </div>
                            {employeeId === 0 ? (
                                <button type="button" className="btn btn-primary float-start" onClick={createClick}>
                                    Create
                                </button>
                            ) : null}
                            {employeeId !== 0 ? (
                                <button type="button" className="btn btn-primary float-start" onClick={updateClick}>
                                    Update
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};