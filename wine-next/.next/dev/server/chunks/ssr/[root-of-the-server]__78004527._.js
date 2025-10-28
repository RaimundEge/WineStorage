module.exports = [
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00859568fc1f613f18f184485b910f9b47fbc62a56":"getTemps","4049ad5e84d3cb88990325cbe4482b37b922797054":"setRange","406a2a2be179cfe3eb67b6b88631ee01e4da258561":"setDegree"},"",""] */ __turbopack_context__.s([
    "getTemps",
    ()=>getTemps,
    "setDegree",
    ()=>setDegree,
    "setRange",
    ()=>setRange
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$sub$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/sub.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"]("mongodb://blitz:27017");
let db = null;
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
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getTemps,
    setRange,
    setDegree
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTemps, "00859568fc1f613f18f184485b910f9b47fbc62a56", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setRange, "4049ad5e84d3cb88990325cbe4482b37b922797054", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setDegree, "406a2a2be179cfe3eb67b6b88631ee01e4da258561", null);
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
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00859568fc1f613f18f184485b910f9b47fbc62a56",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTemps"],
    "4049ad5e84d3cb88990325cbe4482b37b922797054",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setRange"],
    "406a2a2be179cfe3eb67b6b88631ee01e4da258561",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDegree"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__78004527._.js.map