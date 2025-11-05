# REST node service

serves wine room temperature values

## SQlite database: winetemps

create Table Temps (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    value decimal(6,2), 
    date DATETIME DEFAULT (datetime('now', 'localtime'))
);

## sqlite3 install on Raspberry Pi 2

npm install sqlite3 --build-from-source --sqlite=/usr
