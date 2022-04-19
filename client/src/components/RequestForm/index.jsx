import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Input, Grid, Button, Select, MenuItem, Container, Box, TextField } from '@mui/material';
import axios from 'axios';
import { vacationReason } from '../../commonVariables/commonVariables';
import toast, { Toaster } from 'react-hot-toast';
import moment from "moment";

const RequestForm = () => {
    const today = moment(new Date());
    const [reason, setReason] = useState(vacationReason[0]);
    const [comments, setComments] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allFilled, setAllFilled] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [employeesList, setEmployeesList] = useState('');
    const [employee, setEmployee] = useState('');
    const setTheStartDate = (selectedDate) => {
        if (moment(today).isBefore(selectedDate) || moment(today).isSame(selectedDate)) {
            setStartDate(selectedDate)
            setIsValid(true)
        } else {
            setStartDate(null)
            toast.error('Date should not be past date.', {
                style: {
                    color: 'white',
                },
            })
            setIsValid(false)
        }
    }
    const setTheEndDate = (selectedDate) => {
        if (moment(today).isBefore(selectedDate) || moment(today).isSame(selectedDate)) {
            setEndDate(selectedDate)
            setIsValid(true)
        } else {
            setEndDate(null)
            toast.error('Date should not be past date.', {
                style: {
                    color: 'white',
                },
            })
            setIsValid(false)
        }
    }
    useEffect(async () => {
        await axios.get('/api/employees').then(res => setEmployeesList(res.data));
    }, [])
    useEffect(() => {
        if (reason && comments && startDate && endDate && employee) {
            setAllFilled(true);
        }
        else {
            setAllFilled(false);
        }
    }, [reason, comments, startDate, endDate, employee])
    const submitHandler = async (e) => {
        e.preventDefault();
        if (startDate && endDate && reason && comments && employee) {
            const data = {
                employee: employee,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
                comment: comments,
            }
            await axios.post('/api/request', data)
            setEmployee('');
            setTheEndDate('');
            setTheStartDate('');
            setReason('');
            setComments('');
            toast.success('Request submitted successfully!', {
                style: {
                    color: 'white',
                },
            })
        } else {
            toast.error('Fill the form and Try again!', {
                style: {
                    color: 'white',
                },
            })
        }
    }
    const checkDisabled = () => {
        return !isValid || !allFilled
    }
    return (
        <>
            <div className="p-8 md:p-20 lg:p-32">
                <form className="m-auto p-5 md:p-8 rounded-xl border shadow-lg md:shadow-none md:border-none w-full md:flex md:items-start">
                    <div className="flex flex-wrap mb-6 md:mb-0 md:w-full">
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Request Comments</label>
                            <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-50 rounded-full py-3 px-4 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-500" type="text" onChange={e => setComments(e.target.value)} />
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Start Date</label>
                            <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-50 rounded-full py-3 px-4 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-500" type="date" onChange={e => setTheStartDate(e.target.value)} />
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">End Date</label>
                            <input className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-50 rounded-full py-3 px-4 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-500" type="date" onChange={e => setTheEndDate(e.target.value)} />
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0 md:mt-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Vacation Reason</label>
                            <select className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-50 rounded-full py-3 px-4 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-500" value={reason} onChange={e => setReason(e.target.value)}>
                                {vacationReason ?
                                    vacationReason.map(reason => {
                                        return <option key={reason} value={reason}>{reason}</option>
                                    }) : null
                                }
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0 md:mt-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Employee</label>
                            <select className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-50 rounded-full py-3 px-4 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-500" value={employee} onChange={e => setEmployee(e.target.value)}>
                                <option defaultValue='' value=''>Select...</option>
                                {employeesList ?
                                    employeesList.map(emp => {
                                        return <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    }) : null
                                }
                            </select>
                        </div>
                        <div className='hidden md:block md:w-4/12'></div>
                        
                        <div className="w-full md:w-4/12 md:mt-2 px-3 mb-3 md:mb-0 lg:mt-5">
                            <div className="w-full text-center px-3">
                                <button className={`p-3 w-11/12 rounded-lg ${checkDisabled() ? 'bg-gray-100 text-gray-500' : 'bg-cyan-700 text-white shadow-lg '}`} disabled={checkDisabled()} onClick={e => submitHandler(e)}>Request</button>
                            </div>
                        </div>
                        <div className='hidden md:block md:w-4/12'></div>
                    </div>
                </form>
            </div>

            <Toaster position="bottom-center" toastOptions={{
                success: {
                    style: {
                        background: 'green',
                    },
                },
                error: {
                    style: {
                        background: 'red',
                    },
                },
            }} />
        </>
    );
}

export default RequestForm;