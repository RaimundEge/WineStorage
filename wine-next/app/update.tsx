'use client';

import { getTemps, update } from "./actions";

export default function Update({ data }: { data: { temps: { time: string; temp: number }[], degree: string } }) {
    function last() {
        if (data.temps == null || data.temps.length == 0) {
            return ""
        } else {
            // console.log(this.temps.length)
            var lastEntry = data.temps[data.temps.length - 1];
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
        update().then(() => {
            console.log('Ftrigger update');
        });
    };

    return (
        <main className="justify-self-end">
            {last()}&nbsp;&nbsp;
            <button onClick={handleClick} className="bg-transparent px-1 text-blue-700 text-xs border border-blue-500">
                Update
            </button>
        </main>
    );
}