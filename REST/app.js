const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("../temper/winetemps.db");

app.get('/', (req, res) => {
    const { range } = req.query;
    console.log(`Received range: ${range}`);
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
    let since= `date('now', '-${delta} hours')`;
    let query = `SELECT * FROM Temps WHERE date >= ${since};`;
    console.log(`Constructed query: ${query}`);

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});