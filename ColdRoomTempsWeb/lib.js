const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("temper/winetemps.db");
let currentRange = '';
let cachedTemps = [];

function getTemps(range, result) {
    console.log(`Received range: ${range}`);
    if (range === currentRange && cachedTemps.length > 0) {
        console.log(`Using cached data for range: ${range}`);
        // check how old cachedTemps is
        var lastEntryTime = new Date(cachedTemps[cachedTemps.length - 1].x);
        var now = new Date();
        var diffMinutes = (now - lastEntryTime) / (1000 * 60);
        // console.log(`Cached data age in minutes: ${diffMinutes}`);
        if (diffMinutes > 2) {
            console.log(`Cached data is stale, refreshing...`);
            var str = lastEntryTime.toISOString();
            var compTime = str.substring(0, 10) + ' ' + str.substring(11, 19);
            let query = `SELECT * FROM Temps WHERE date > '${compTime}';`;
            // console.log(`Constructed query: ${query}`);
            db.all(query, [], (err, rows) => {
                if (err) {
                    res.status(500).send(err.message);
                    return;
                }
                console.log(`Retrieved ${rows.length} rows`);
                // convert to local time
                rows.forEach(row => {
                    cachedTemps.push({
                        x: new Date(row.date + 'Z').toString(),
                        y: row.value
                    });
                });
                result(cachedTemps);
            });
        } else {
            result(cachedTemps);
        }
    } else {
        let delta = 1;
        switch (range) {
            case "all": delta = 24 * 365; break;
            case 'hour': delta = 1; break;
            case '2hours': delta = 2; break;
            case '6hours': delta = 6; break;
            case '12hours': delta = 12; break;
            case 'day': delta = 24; break;
            case 'cold': delta = 24; break;
            case '2day': delta = 48; break;
            case 'week': delta = 7 * 24; break;
            case 'month': delta = 30 * 24; break;
            case '6months': delta = 180 * 24; break;
        }
        let since = `datetime('now', '-${delta} hours')`;
        let query = `SELECT * FROM Temps WHERE date >= ${since};`;
        console.log(`Constructed query: ${query}`);

        db.all(query, [], (err, rows) => {
            if (err) {
                res.status(500).send(err.message);

                return;
            }
            console.log(`Retrieved ${rows.length} rows`);
            // console.log('last row date:', rows[rows.length - 1].date);
            // convert to local time
            var data = rows.map(row => {
                return {
                    x: new Date(row.date + 'Z').toString(),
                    y: row.value
                };
            });
            cachedTemps = data;
            currentRange = range;
            result(data);
        });
    }

}

module.exports = { getTemps, db };