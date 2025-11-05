'use server';

import { revalidatePath } from "next/cache";
import axios from "axios";

// REST access to pioneer wine cellar temperature logger
let range: string = "day";
let degree: string = "fahrenheit";

interface Item {
    time: string;
    temp: number;
}
let temps: Item[] = [];

export async function getTemps() {
    // call pione REST API for sqlite temp data
    var resp = await axios.get('http://pione:3000/oldTemps/' + `?range=${range}`)
    // console.log(resp.data);
    temps = [];
    resp.data.forEach((doc: any) => {
        // console.log('at: ', doc.date, ': ', doc.value);
        temps.push({ time: doc.date, temp: degree == 'celsius' ? doc.value : ((doc.value * 9 / 5) + 32) });
    });
    return { temps: temps, degree: degree, range: range };
}

export async function setRange(newRange: string) {
    range = newRange;
    // console.log("Range set to ", range);
    revalidatePath("/");
}
export async function setDegree(newDegree: string) {
    degree = newDegree;
    // console.log("Degree set to ", degree);
    revalidatePath("/");
}
export async function update() {
    // check whether we need to fetch new data
    var lastTime = new Date(temps[temps.length - 1].time);
    var now = new Date();
    var diffMins = (now.getTime() - lastTime.getTime()) / (1000 * 60);
    console.log('Minutes since last entry: ', diffMins);
}