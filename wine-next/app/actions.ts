'use server';

import * as mongoDB from "mongodb";
import { sub } from 'date-fns';
import { revalidatePath } from "next/cache";
import axios from "axios";

// now longer via mongodb, but kept for reference
const client = new mongoDB.MongoClient("mongodb://blitz:27017");
let db: mongoDB.Db | null = null;
// REST access to pioneer wine cellar temperature logger
let range: string = "day";
let degree: string = "fahrenheit";

interface Item {
    time: string;
    temp: number;
}
let temps: Item[] = [];

async function connect() {
    await client.connect();
    db = client.db("wine");
    // console.log("Connected to MongoDB");
}

function halfSize(rawTemps: mongoDB.WithId<mongoDB.BSON.Document>[]): mongoDB.WithId<mongoDB.BSON.Document>[] {
    // console.log('starting length: ', rawTemps.length);
    var newTemps: mongoDB.WithId<mongoDB.BSON.Document>[] = [];
    var prevTime = '';
    var prevItem: mongoDB.WithId<mongoDB.BSON.Document> | null = null;
    newTemps.push(rawTemps[0]);
    for (var item of rawTemps) {
        if (prevTime === '') {
            prevItem = item;
            prevTime = item.time;
        } else {
            var d1msecs = (prevItem!.time as Date).getTime();
            var d2msecs = (item.time as Date).getTime();
            var avgTime = (d1msecs + d2msecs) / 2;
            var result = new Date(avgTime);
            var temp = (prevItem!.value + item.value) / 2;
            newTemps.push({ _id: item._id, time: result, value: temp });
            prevTime = '';
        }
    }
    // console.log('new length: ', newTemps.length);
    return newTemps;
}

export async function getTemps() {
    // call pione REST API for sqlite temp data
    var resp = await axios.get('http://pione:3000/' + `?range=${range}`)
    // console.log(resp.data);
    var temps: Item[] = [];
    resp.data.forEach(doc => {
        // var dateString = doc.date.toISOString();
        // console.log('at: ', doc.date, ': ', doc.value);
        temps.push({ time: doc.date, temp: degree == 'celsius' ? doc.value : ((doc.value * 9 / 5) + 32) });
    });
    return { temps: temps, degree: degree, range: range };
}
export async function getTempsMongo() {
    if (!db) {
        await connect();
    }
    var delta = 0;
    switch (range) {
        case "all": delta = 24 * 365; break;
        case 'hour': delta = 1; break;
        case '2hours': delta = 2; break;
        case '6hours': delta = 6; break;
        case '12hours': delta = 12; break;
        case 'day': delta = 24; break;
        case '2day': delta = 48; break;
        case 'week': delta = 7 * 24; break;
        case 'month': delta = 30 * 24; break;
    }
    var compare = new Date();
    // console.log('Today is: ' + compare.toISOString());
    compare = sub(compare, { hours: delta });
    var search = { "time": { $gt: compare } };
    // console.log(search);

    var rawTemps = await db!.collection("temps").find(search, { sort: [["time", "desc"]] }).toArray();
    temps = [];
    while (rawTemps.length > 4000) {
        rawTemps = halfSize(rawTemps);
    }
    rawTemps.forEach(doc => {
        // console.log('time: ', doc.time.toISOString(), doc.value);
        doc.time = doc.time.toISOString();
        temps.push({ time: doc.time, temp: degree == 'celsius' ? doc.value : ((doc.value * 9 / 5) + 32) });
    });
    // console.log(temps)
    // console.log("Sending ", temps.length, "records");
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
    if (!db) {
        await connect();
    }
    var lastEntry = await db!.collection("temps").findOne({}, { sort: [["time", -1]] });
    var lastTime = lastEntry ? lastEntry.time : new Date(0);
    var now = new Date();
    var diffMins = (now.getTime() - lastTime.getTime()) / (1000 * 60);
    console.log('Minutes since last entry: ', diffMins);

}