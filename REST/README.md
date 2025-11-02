# REST node service

serves wine room temperature values

## SQlite database: winetemps

create Table Temps (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    value decimal(6,2), 
    date DATETIME DEFAULT (datetime('now', 'localtime'))
);
