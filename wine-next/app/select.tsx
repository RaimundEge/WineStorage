'use client';

import { setRange, setDegree } from "./actions";

export default function Select() {
    
    const handleSelect = (event: any) => {
        console.log('Selected range:', event.target.value);
        setRange(event.target.value);
    }
    function handleRadio(event: any) {
        console.log('Selected degree:', event.target.value);
        setDegree(event.target.value);
    }
    return (
        <main>
            <div className="line-one">
                <label>Show:
                    <select name="range" defaultValue="day" onChange={handleSelect}>
                        <option value="all">all</option>
                        <option value="hour">last hour</option>
                        <option value="2hours">last 2 hours</option>
                        <option value="6hours">last 6 hours</option>
                        <option value="12hours">last 12 hours</option>
                        <option value="day">last 24 hours</option>
                        <option value="2day">last 48 hours</option>
                        <option value="week">last 7 days</option>
                        <option value="month">last 30 days</option>
                        <option value="day">Cold Room</option>
                    </select>
                </label>&nbsp;
                <div className="item-radio" onChange={handleRadio}>
                    Select degrees:&nbsp;
                    <label> <input type="radio" value="fahrenheit" name="degree" defaultChecked={true} /> Fahrenheit</label>
                    <label> <input type="radio" value="celsius" name="degree" /> Celsius</label>
                </div>
            </div>
        </main>
    );
}