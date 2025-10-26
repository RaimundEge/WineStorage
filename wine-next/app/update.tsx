'use client';

import { getTemps } from "./actions";

export default function Update({ data }: { data: {temps: { time: string; temp: number }[], degree: string }}) {
    function last() {
        if (data.temps == null || data.temps.length == 0) {
            return ""
        } else {
            // console.log(this.temps.length)
            var lastEntry = data.temps[0]
            var sum = 0;
            for (var item of data.temps) {
                sum += item.temp;
            }
           let average = sum / data.temps.length;
            var temp = Math.round(lastEntry.temp * 10) / 10 + '\xB0'
            var avg = Math.round(average * 10) / 10 + '\xB0'
            return temp + "(avg: " + avg + ") at " + new Date(lastEntry.time).toString().slice(0, 21);
        }
    }
    const handleClick = () => {
        getTemps().then((temps) => {
            console.log('Fetched updated temps:', temps.temps.length);
        });
    };

    return (
        <main>
            { last() }&nbsp;
            <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Update
            </button>
        </main>
    );
}