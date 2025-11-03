module.exports = [
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0063d7fa46094d718f1fd21ffff72673ea49887914":"update","00859568fc1f613f18f184485b910f9b47fbc62a56":"getTemps","00b9d069306e82724f3207048ef12fc7ea02094ace":"getTempsMongo","4049ad5e84d3cb88990325cbe4482b37b922797054":"setRange","406a2a2be179cfe3eb67b6b88631ee01e4da258561":"setDegree"},"",""] */ __turbopack_context__.s([
    "getTemps",
    ()=>getTemps,
    "getTempsMongo",
    ()=>getTempsMongo,
    "setDegree",
    ()=>setDegree,
    "setRange",
    ()=>setRange,
    "update",
    ()=>update
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$sub$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/sub.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
// now longer via mongodb, but kept for reference
const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"]("mongodb://blitz:27017");
let db = null;
// REST access to pioneer wine cellar temperature logger
let range = "day";
let degree = "fahrenheit";
let temps = [];
async function connect() {
    await client.connect();
    db = client.db("wine");
// console.log("Connected to MongoDB");
}
function halfSize(rawTemps) {
    // console.log('starting length: ', rawTemps.length);
    var newTemps = [];
    var prevTime = '';
    var prevItem = null;
    newTemps.push(rawTemps[0]);
    for (var item of rawTemps){
        if (prevTime === '') {
            prevItem = item;
            prevTime = item.time;
        } else {
            var d1msecs = prevItem.time.getTime();
            var d2msecs = item.time.getTime();
            var avgTime = (d1msecs + d2msecs) / 2;
            var result = new Date(avgTime);
            var temp = (prevItem.value + item.value) / 2;
            newTemps.push({
                _id: item._id,
                time: result,
                value: temp
            });
            prevTime = '';
        }
    }
    // console.log('new length: ', newTemps.length);
    return newTemps;
}
async function getTemps() {
    // call pione REST API for sqlite temp data
    var resp = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get('http://pione:3000/' + `?range=${range}`);
    // console.log(resp.data);
    var temps = [];
    resp.data.forEach((doc)=>{
        // console.log('at: ', doc.date, ': ', doc.value);
        temps.push({
            time: doc.date,
            temp: degree == 'celsius' ? doc.value : doc.value * 9 / 5 + 32
        });
    });
    return {
        temps: temps,
        degree: degree,
        range: range
    };
}
async function getTempsMongo() {
    if (!db) {
        await connect();
    }
    var delta = 0;
    switch(range){
        case "all":
            delta = 24 * 365;
            break;
        case 'hour':
            delta = 1;
            break;
        case '2hours':
            delta = 2;
            break;
        case '6hours':
            delta = 6;
            break;
        case '12hours':
            delta = 12;
            break;
        case 'day':
            delta = 24;
            break;
        case '2day':
            delta = 48;
            break;
        case 'week':
            delta = 7 * 24;
            break;
        case 'month':
            delta = 30 * 24;
            break;
    }
    var compare = new Date();
    // console.log('Today is: ' + compare.toISOString());
    compare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$sub$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sub"])(compare, {
        hours: delta
    });
    var search = {
        "time": {
            $gt: compare
        }
    };
    // console.log(search);
    var rawTemps = await db.collection("temps").find(search, {
        sort: [
            [
                "time",
                "desc"
            ]
        ]
    }).toArray();
    temps = [];
    while(rawTemps.length > 4000){
        rawTemps = halfSize(rawTemps);
    }
    rawTemps.forEach((doc)=>{
        // console.log('time: ', doc.time.toISOString(), doc.value);
        doc.time = doc.time.toISOString();
        temps.push({
            time: doc.time,
            temp: degree == 'celsius' ? doc.value : doc.value * 9 / 5 + 32
        });
    });
    // console.log(temps)
    // console.log("Sending ", temps.length, "records");
    return {
        temps: temps,
        degree: degree,
        range: range
    };
}
async function setRange(newRange) {
    range = newRange;
    // console.log("Range set to ", range);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
}
async function setDegree(newDegree) {
    degree = newDegree;
    // console.log("Degree set to ", degree);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
}
async function update() {
    // check whether we need to fetch new data
    if (!db) {
        await connect();
    }
    var lastEntry = await db.collection("temps").findOne({}, {
        sort: [
            [
                "time",
                -1
            ]
        ]
    });
    var lastTime = lastEntry ? lastEntry.time : new Date(0);
    var now = new Date();
    var diffMins = (now.getTime() - lastTime.getTime()) / (1000 * 60);
    console.log('Minutes since last entry: ', diffMins);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getTemps,
    getTempsMongo,
    setRange,
    setDegree,
    update
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTemps, "00859568fc1f613f18f184485b910f9b47fbc62a56", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTempsMongo, "00b9d069306e82724f3207048ef12fc7ea02094ace", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setRange, "4049ad5e84d3cb88990325cbe4482b37b922797054", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setDegree, "406a2a2be179cfe3eb67b6b88631ee01e4da258561", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(update, "0063d7fa46094d718f1fd21ffff72673ea49887914", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0063d7fa46094d718f1fd21ffff72673ea49887914",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["update"],
    "00859568fc1f613f18f184485b910f9b47fbc62a56",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTemps"],
    "00b9d069306e82724f3207048ef12fc7ea02094ace",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTempsMongo"],
    "4049ad5e84d3cb88990325cbe4482b37b922797054",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setRange"],
    "406a2a2be179cfe3eb67b6b88631ee01e4da258561",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDegree"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1c7581c4._.js.map