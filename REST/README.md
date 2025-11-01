# REST node service

serves wine room temperature values

## SQlite database: winetemps

create Table Temps (
    id int not null primary key, 
    value decimal(6,2), 
    date DATETIME DEFAULT (datetime('now', 'localtime'))
);
