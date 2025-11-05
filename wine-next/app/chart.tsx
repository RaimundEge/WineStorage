"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart({ data }: { data: { temps: { time: string; temp: number }[], degree: string, range: string } }) {
    var dateData: { x: Date, y: number }[] = [];
    var idealLow: { x: Date, y: number }[] = [];
    var idealHigh: { x: Date, y: number }[] = [];
    var minTemp = 100, maxTemp = 0;
    for (var item of data.temps) {
        var time = new Date(item.time);
        if (item.temp < minTemp) minTemp = item.temp;
        if (item.temp > maxTemp) maxTemp = item.temp;
        dateData.push({ x: time, y: item.temp });
        idealLow.push({ x: time, y: data.degree == 'celsius' ? 16 : 61.0 });
        idealHigh.push({ x: time, y: data.degree == 'celsius' ? 20 : 68.0 });
    }
    const lineData: any = {
        datasets: [
            { data: dateData, label: 'actual', borderColor: '#f00' },
            { data: idealLow, label: 'ideal low', borderColor: '#0f0', borderWidth: '1', borderDash: [5, 5] },
            { data: idealHigh, label: 'ideal high', borderColor: '#00f', borderWidth: '1', borderDash: [5, 5] },
        ]
    };
    var tickFormat = 'MMM d, HH:mm';
    switch (data.range) {
        case 'hour':
        case '2hours':
        case '6hours':
        case '12hours':
        case 'day': tickFormat = 'HH:MM'; break;
    }
    const options: any = {
        scales: {
            x: {
                grid: { display: false },
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: { hour: tickFormat }
                }
            },
            y: {
                min: minTemp - (data.degree == 'celsius' ? 5 : 9),
                max: maxTemp + (data.degree == 'celsius' ? 5 : 9),
                grid: { display: false },
                ticks: { stepSize: 5 },
            },
        },
        pointStyle: false,
    };
    return (
        <main>
            <Line data={lineData} options={options} />
        </main>
    );
}