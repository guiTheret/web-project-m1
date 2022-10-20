import { useEffect, useState } from 'react'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from 'react-bootstrap/Button';

import "./Account.css"

import api from "../../api/api";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
interface displayDate {
    date: Date;
    isSelected: boolean;
}

export default function Account({ isCleaner, userInfo }: { isCleaner: number, userInfo: any }) {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [availableDate, setAvailableDate] = useState<Array<displayDate>>([]);
    /*
    useEffect(() => {
        const today = new Date();
        const baseDate = startDate;

        if (baseDate < today) return setAvailableDate([]);
        const baseArray = [];
        baseDate.setHours(8, 0, 0);
        baseArray.push({ date: baseDate, isSelected: false });
        for (let i = 0; i < 19; i++) {
            const date = new Date(baseDate.getTime() + 30 * (i + 1) * 60000)
            if (date > today) {
                baseArray.push({ date, isSelected: false });
            }

        }

        setAvailableDate(baseArray);

    }, [startDate])
    */
    function getDaysInMonth(month: number, year: number) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            date.setHours(8);
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
            
        }
        return days;
    }

    const fetchAvailable = async () => {
        const year = startDate.getFullYear();
        const month = startDate.getMonth();
        const res = await api.get(`/cleaner/available/${userInfo.id}/${year}/${month}`)

        const data = res.data.data;
        const fullMonthArray: Array<Date> = getDaysInMonth(month, year);
        const finalArray: Array<displayDate> = [];
        fullMonthArray.forEach((value: Date) => {
            let found: boolean = false;
            data.forEach((date: any) => { //any car c'est le retour de l'api faudrait le fix
                const dbDate = new Date(date.day);
                dbDate.setHours(8);
                if (value.getTime() === dbDate.getTime()) {
                    found = true;
                }
            })
            finalArray.push({ isSelected: found, date: value, })
        })
        setAvailableDate(finalArray);
    }
    useEffect(() => {
        fetchAvailable()
    }, [startDate])

    const setNextMonth = () => {
        var newDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        setStartDate(newDate);
    }
    const setPreviousMonth = () => {
        var newDate = new Date(startDate.setMonth(startDate.getMonth() - 1));
        setStartDate(newDate);
    }

    const setSelected = (index: number) => {
        const newArray = [...availableDate];
        newArray[index].isSelected = !newArray[index].isSelected;
        setAvailableDate(newArray);
    }

    const selectAll = (bool: boolean) => {
        const newArray = [...availableDate];
        newArray.map((val, index) => {
            newArray[index].isSelected = bool;
        })
        setAvailableDate(newArray);
    }

    const confirm = () => {
        const body = {
            availableDate: availableDate,
            month: startDate.getMonth(),
            year: startDate.getFullYear()
        }
        console.log(availableDate);
        api.post('/cleaner/setAvailable', body);
    }
    if (isCleaner === 1) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Your availability</h1>
                {/*
                <div>
                    <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} />
                </div>
                 */}
                <div className="select-container">
                    <Button style={{ marginRight: 10 }} onClick={() => setPreviousMonth()} variant="outline-primary">Previous month</Button>
                    <p>{months[startDate.getMonth()]} {startDate.getFullYear()}</p>
                    <Button style={{ marginLeft: 10 }} onClick={() => setNextMonth()} variant="outline-primary">Next month</Button>
                </div>
                <div style={{ marginTop: 20, marginBottom: 10 }}>
                    <Button style={{ marginRight: 10, width: 120 }} variant="primary" onClick={() => selectAll(true)}>Select all</Button>
                    <Button variant="danger" style={{ width: 120 }} onClick={() => selectAll(false)}>Un select all</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap', maxWidth: 1000, justifyContent: 'center' }}>
                    {availableDate.map((available, index) => {
                        return (
                            <div key={index} onClick={() => setSelected(index)} style={{ padding: 10, backgroundColor: available.isSelected === false ? "red" : "#0D6EFD", margin: 5, width: 100, alignItems: "center", height: 50, borderRadius: 5 }}>
                                <p style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>{available.date.getDate()}</p>
                            </div>
                        )
                    })}
                    {availableDate.length === 0 &&
                        <p>No time slot available for this date. Try another day</p>
                    }
                </div>

                {availableDate.length > 0 &&
                    <Button variant="success" onClick={() => confirm()}>Validate</Button>
                }
            </div>
        )
    } else {
        return (
            <></>
        )
    }

}
