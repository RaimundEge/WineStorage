'use server';

import * as mongoDB from "mongodb";
import { sub } from 'date-fns';
import { revalidatePath } from "next/cache";

const client = new mongoDB.MongoClient("mongodb://blitz:27017");
let db: mongoDB.Db | null = null;
let range: string = "6hours";
let degree: string = "fahrenheit";

interface Item {
  time: string;
  temp: number;
}

async function connect() {
    await client.connect();
    db = client.db("wine");
    console.log("Connected to MongoDB");
}

export async function getTemps() {
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
    let temps: Item[] = [];
    rawTemps.forEach(doc => {
        doc.time = (doc.time as Date).toISOString();
        temps.push({time: doc.time, temp: degree == 'celsius' ? doc.value : ((doc.value * 9 / 5) + 32)});
    });
    // console.log(temps)
    console.log("Fetched ", temps.length, "records");
    return {temps: temps, degree: degree, range: range};
}

export async function setRange(newRange: string) {
    range = newRange;
    console.log("Range set to ", range);
    revalidatePath("/");
}
export async function setDegree(newDegree: string) {
    degree = newDegree;
    console.log("Degree set to ", degree);
    revalidatePath("/");
}