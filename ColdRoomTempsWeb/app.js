const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const lib = require("./lib");

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/latest', (req, res) => {
    const { range, degree } = req.query;
    lib.getTemps(range, (rows) => {
        res.render('temps', { data: rows, degree: degree  });
    });
});

app.get('/oldTemps', (req, res) => {
    const { range } = req.query;
    console.log(`/oldTemps for range: ${range}`);
    let delta = 0;
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
    }
    let since = `datetime('now', '-${delta} hours')`;
    let query = `SELECT * FROM Temps WHERE date >= ${since};`;
    console.log(`Constructed query: ${query}`);

    lib.db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);

            return;
        }
        console.log(`Retrieved ${rows.length} rows`);
        // convert to local time
        rows = rows.map(row => {
            // console.log(`Original date: ${row.date}`);
            row.date = new Date(row.date + 'Z').toString();
            // console.log(`Converted date: ${row.date}`);
            return row;
        });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});