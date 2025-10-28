'use client';

import { setRange, setDegree } from "./actions";

export default function Select({ data }: { data: {temps: { time: string; temp: number }[], degree: string, range: string }}) {
    
    const handleSelect = (event: any) => {
        // console.log('Selected range:', event.target.value);
        setRange(event.target.value);
    }
    function handleRadio(event: any) {
        // console.log('Selected degree:', event.target.value);
        setDegree(event.target.value);
    }
    return (
        <main>
            <div className="flex flex-row">
                <label>Show: &nbsp;
                    <select name="range" defaultValue={data.range} onChange={handleSelect} className="border border-blue-500 text-xs">
                        <option value="day">Cold Room</option>
                        <option value="hour">last hour</option>
                        <option value="2hours">last 2 hours</option>
                        <option value="6hours">last 6 hours</option>
                        <option value="12hours">last 12 hours</option>
                        <option value="day">last 24 hours</option>
                        <option value="2day">last 48 hours</option>
                        <option value="week">last 7 days</option>
                        <option value="month">last 30 days</option>
                        <option value="all">all</option>
                    </select>
                </label>&nbsp;&nbsp;
                <div onChange={handleRadio}>
                    Select degrees:&nbsp;
                    <label className="text-xs"> <input type="radio" value="fahrenheit" name="degree" defaultChecked={data.degree=="fahrenheit"} /> Fahrenheit</label>
                    <label className="text-xs"> <input type="radio" value="celsius" name="degree" defaultChecked={data.degree=="celsius"}/> Celsius</label>
                </div>
            </div>
        </main>
    );
}